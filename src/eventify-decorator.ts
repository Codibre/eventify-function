import { createMethodDecorator } from 'decorator-builder';
import { AbstractClass, Func, isClass } from 'is-this-a-pigeon';
import { eventifyFunction } from './eventify-function';
import { EventifiedFunc, EventifyApplier } from './types';

export const Eventify = createMethodDecorator<
	(
		applierClass: AbstractClass<EventifyApplier<Func>> | EventifyApplier<Func>,
	) => void
>((item) => {
	const eventified: EventifiedFunc<Func> = eventifyFunction(
		item.target[item.name as keyof Object] as any,
	);
	item.target[item.name as keyof Object] = eventified;
	if (item.descriptor.set) {
		item.descriptor.set(eventified);
	} else {
		item.descriptor.value = eventified;
	}
	const applier = item.args[0];
	if (!isClass(applier)) {
		(applier as EventifyApplier<Func>).applyListeners(eventified);
	}
});
