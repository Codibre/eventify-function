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

function dealWithError(
	emitter: FunctionEmitter<Func>,
	callId: string,
	err: any,
	args: any[],
): any {
	emitter.emit('error', callId, err, ...args);
	throw err;
}

function dealWithResult(
	emitter: FunctionEmitter<Func>,
	callId: string,
	result: any,
	args: any[],
): any {
	emitter.emit('end', callId, result, ...args);
	return result;
}

async function* dealWithAsyncIterable<T>(
	emitter: FunctionEmitter<Func>,
	callId: string,
	result: AsyncIterable<T>,
	args: any[],
) {
	try {
		for await (const item of result) {
			emitter.emit('yielded', callId, item, ...args);
			yield item;
		}
	} catch (err) {
		return dealWithError(emitter, callId, err, args);
	}
	emitter.emit('iterated', callId, ...args);
}

function* dealWithIterable<T>(
	emitter: FunctionEmitter<Func>,
	callId: string,
	result: Iterable<T>,
	args: any[],
) {
	try {
		for (const item of result) {
			emitter.emit('yielded', callId, item, ...args);
			yield item;
		}
	} catch (err) {
		return dealWithError(emitter, callId, err, args);
	}
	emitter.emit('iterated', callId, ...args);
}

function decideWhatToDoWithResult<T>(
	emitter: FunctionEmitter<Func>,
	callId: string,
	result: T,
	args: any[],
) {
	if (isOnlyIterable(result)) {
		return dealWithIterable(emitter, callId, result, args);
	} else if (isAsyncIterable(result)) {
		return dealWithAsyncIterable(emitter, callId, result, args);
	}
	return dealWithResult(emitter, callId, result, args);
}

async function dealWithPromise<TFunc extends Func>(
	emitter: FunctionEmitter<TFunc>,
	callId: string,
	result: PromiseLike<ReturnType<TFunc>>,
	args: Parameters<TFunc>,
) {
	try {
		return decideWhatToDoWithResult(emitter, callId, await result, args);
	} catch (err) {
		return dealWithError(emitter, callId, err, args);
	}
}

function getFunc<TFunc extends Func>(
	callback: TFunc,
	listener: FunctionEmitter<TFunc>,
) {
	return function (this: any, ...args: Parameters<TFunc>): ReturnType<TFunc> {
		let result: ReturnType<TFunc>;
		const callId = v4();
		listener.emit('init', callId, ...args);
		try {
			result = callback.call(this, ...args);
		} catch (err) {
			return dealWithError(listener, callId, err, args);
		}
		return isPromiseLike(result)
			? dealWithPromise(listener, callId, result, args)
			: decideWhatToDoWithResult(listener, callId, result, args);
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
