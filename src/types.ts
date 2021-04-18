import TypedEventEmitter from 'typed-emitter';
import { Func, AnyIterableItem } from 'is-this-a-pigeon';

interface Events<TFunc extends Func> {
	init(uniqueId: string, ...args: Parameters<TFunc>): void;
	end(
		uniqueId: string,
		result: ReturnType<TFunc>,
		...args: Parameters<TFunc>
	): void;
	yielded(
		uniqueId: string,
		value: AnyIterableItem<ReturnType<TFunc>>,
		...args: Parameters<TFunc>
	): void;
	iterated(uniqueId: string, ...args: Parameters<TFunc>): void;
	error(uniqueId: string, error: any, ...args: Parameters<TFunc>): void;
}

export type DecoratorEvents<TFunc extends Func> = Partial<Events<TFunc>>;

export interface FunctionListener<TFunc extends Func> {
	<E extends keyof Events<TFunc>>(
		event: E,
		listener: Events<TFunc>[E],
	): FunctionEmitter<TFunc>;
}

export interface FuncListeners<TFunc extends Func> {
	on: FunctionListener<TFunc>;
	once: FunctionListener<TFunc>;
	off: FunctionListener<TFunc>;
}

export type EventifiedFunc<TFunc extends Func> = TFunc & FuncListeners<TFunc>;

export type FunctionEmitter<TFunc extends Func> = TypedEventEmitter<
	Events<TFunc>
>;

export interface EventifyApplier<F extends Func> {
	applyListeners(eventifiedMethod: FuncListeners<F>): void;
}
