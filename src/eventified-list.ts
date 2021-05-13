import { Class, Func } from 'is-this-a-pigeon';
import { EventifiedFunc, EventifyApplier } from './types';

export const eventifiedList: [
	EventifiedFunc<Func>,
	Class<EventifyApplier<Func>>,
][] = [];
