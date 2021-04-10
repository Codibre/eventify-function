import TypedEventEmitter from 'typed-emitter';
import { Func, AnyIterableItem } from 'is-this-a-pigeon';

interface Events<TFunc extends Func> {
	init(uuid: string, ...args: Parameters<TFunc>): void;
	end(
		uuid: string,
		result: ReturnType<TFunc>,
		...args: Parameters<TFunc>
	): void;
	yielded(
		uuid: string,
		value: AnyIterableItem<ReturnType<TFunc>>,
		...args: Parameters<TFunc>
	): void;
	iterated(uuid: string, ...args: Parameters<TFunc>): void;
	error(uuid: string, error: any, ...args: Parameters<TFunc>): void;
}

export type DecoratorEvents<TFunc extends Func> = Partial<Events<TFunc>>;

export interface FunctionListener<TFunc extends Func> {
	<E extends keyof Events<TFunc>>(
		event: E,
		listener: Events<TFunc>[E],
	): FunctionEmitter<TFunc>;
}

export type EventifiedFunc<TFunc extends Func> = TFunc & {
	on: FunctionListener<TFunc>;
	once: FunctionListener<TFunc>;
	off: FunctionListener<TFunc>;
};

export type FunctionEmitter<TFunc extends Func> = TypedEventEmitter<
	Events<TFunc>
>;