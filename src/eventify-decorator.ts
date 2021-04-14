import { createMethodDecorator } from 'decorator-builder';
import { AbstractClass } from 'is-this-a-pigeon';
import { eventifyFunction } from './eventify-function';
import { EventifyApplier } from './types';

export const Eventify = createMethodDecorator<
	(
		applierClass:
			| AbstractClass<EventifyApplier<Object, any>>
			| EventifyApplier<Object, any>,
	) => void
>((item) => {
	item.target[item.name as keyof Object] = eventifyFunction(
		item.target[item.name as keyof Object] as any,
	);
});
