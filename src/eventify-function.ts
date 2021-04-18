import { FunctionEmitter, EventifiedFunc } from './types';
import { isEventified } from './utils';
import { EventEmitter } from 'events';
import {
	Func,
	isAsyncIterable,
	isOnlyIterable,
	isPromiseLike,
} from 'is-this-a-pigeon';
import { eventified } from './symbol';
import { v4 } from 'uuid';

const callIdSymbol = Symbol('EventifyCallId');
const contextSymbol = Symbol('EventifyContext');
const contexts = new Map<string, Map<string, unknown>>();

function clearContext(id: string) {
	contexts.delete(id);
}

function getContext(self: string | any): Map<string, unknown> {
	return typeof self === 'string' ? contexts.get(self) : self?.[contextSymbol];
}

function dealWithError(
	emitter: FunctionEmitter<Func>,
	id: string,
	err: any,
	args: any[],
): any {
	emitter.emit('error', id, err, ...args);
	clearContext(id);
	throw err;
}

function dealWithResult(
	emitter: FunctionEmitter<Func>,
	id: string,
	result: any,
	args: any[],
): any {
	emitter.emit('end', id, result, ...args);
	clearContext(id);
	return result;
}

async function* dealWithAsyncIterable<T>(
	emitter: FunctionEmitter<Func>,
	id: string,
	result: AsyncIterable<T>,
	args: any[],
) {
	try {
		for await (const item of result) {
			emitter.emit('yielded', id, item, ...args);
			yield item;
		}
	} catch (err) {
		return dealWithError(emitter, id, err, args);
	}
	emitter.emit('iterated', id, ...args);
	clearContext(id);
}

function* dealWithIterable<T>(
	emitter: FunctionEmitter<Func>,
	id: string,
	result: Iterable<T>,
	args: any[],
) {
	try {
		for (const item of result) {
			emitter.emit('yielded', id, item, ...args);
			yield item;
		}
	} catch (err) {
		return dealWithError(emitter, id, err, args);
	}
	emitter.emit('iterated', id, ...args);
	clearContext(id);
}

function decideWhatToDoWithResult<T>(
	emitter: FunctionEmitter<Func>,
	id: string,
	result: T,
	args: any[],
) {
	if (isOnlyIterable(result)) {
		return dealWithIterable(emitter, id, result, args);
	} else if (isAsyncIterable(result)) {
		return dealWithAsyncIterable(emitter, id, result, args);
	}
	return dealWithResult(emitter, id, result, args);
}

async function dealWithPromise<TFunc extends Func>(
	emitter: FunctionEmitter<TFunc>,
	id: string,
	result: PromiseLike<ReturnType<TFunc>>,
	args: Parameters<TFunc>,
) {
	try {
		return decideWhatToDoWithResult(emitter, id, await result, args);
	} catch (err) {
		return dealWithError(emitter, id, err, args);
	}
}

function getSelf(self: any, id: string) {
	if (typeof self === 'object') {
		const context = new Map<string, unknown>();
		contexts.set(id, context);
		self = new Proxy(self, {
			get(target, p) {
				switch (p) {
					case callIdSymbol:
						return id;
					case contextSymbol:
						return context;
					default:
						return target[p];
				}
			},
		});
	}
	return self;
}

function getFunc<TFunc extends Func>(
	callback: TFunc,
	listener: FunctionEmitter<TFunc>,
) {
	return function (this: any, ...args: Parameters<TFunc>): ReturnType<TFunc> {
		let result: ReturnType<TFunc>;
		const id = v4();
		const self = getSelf(this, id);
		listener.emit('init', id, ...args);
		try {
			result = callback.call(self, ...args);
		} catch (err) {
			return dealWithError(listener, id, err, args);
		}
		return isPromiseLike(result)
			? dealWithPromise(listener, id, result, args)
			: decideWhatToDoWithResult(listener, id, result, args);
	} as EventifiedFunc<TFunc>;
}

export function eventifyFunction<TFunc extends Func>(
	callback: TFunc,
): EventifiedFunc<TFunc> {
	if (isEventified(callback)) {
		return callback as EventifiedFunc<TFunc>;
	}
	const listener = new EventEmitter() as FunctionEmitter<TFunc>;
	const func = getFunc<TFunc>(callback, listener);
	func.on = listener.on.bind(listener);
	func.once = listener.once.bind(listener);
	func.off = listener.off.bind(listener);
	Object.defineProperty(func, eventified, {
		enumerable: false,
		writable: false,
		value: true,
	});
	return func;
}

export function callId(self: any): string {
	const id = self?.[callIdSymbol];

	if (!id) {
		throw TypeError(
			'callId must be called inside an eventified method passing "this" as parameter',
		);
	}

	return id;
}

function validEventMap(map: Map<string, unknown>) {
	if (!map) {
		throw TypeError(
			'eventMapGet must be called inside an eventified method passing "this" as parameter or informing the call id',
		);
	}
}

export function eventMapGet(id: string, key: string): unknown | undefined;
export function eventMapGet(self: any, key: string): unknown | undefined;
export function eventMapGet(self: any, key: string): unknown | undefined {
	const map: Map<string, unknown> = getContext(self);
	validEventMap(map);
	return map.get(key);
}

export function eventMapSet(id: string, key: string, value: unknown): void;
export function eventMapSet(self: any, key: string, value: unknown): void;
export function eventMapSet(self: any, key: string, value: unknown): void {
	const map: Map<string, unknown> = getContext(self);
	validEventMap(map);
	map.set(key, value);
}
