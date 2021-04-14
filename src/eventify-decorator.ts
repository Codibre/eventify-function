import { createMethodDecorator } from 'decorator-builder';
import { AbstractClass } from 'is-this-a-pigeon';
import { EventifyApplier } from './types';

export const Eventify = createMethodDecorator<
	(applierClass: AbstractClass<EventifyApplier<Object, any>>) => void
>();
