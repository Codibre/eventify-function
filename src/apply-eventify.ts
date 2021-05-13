import { Class, Func, isClass } from 'is-this-a-pigeon';
import { eventifiedList } from './eventified-list';
import { EventifyApplier } from './types';

function getApplier(
	ref: unknown,
	getInstance: <T extends EventifyApplier<Func>>(cls: Class<T>) => T,
) {
	return isClass(ref) ? getInstance(ref) : undefined;
}

function validateGetInstance(value: unknown) {
	if (!value) {
		throw new TypeError('getInstance must be specified');
	}
}

export function applyEventify(
	getInstance?: <T extends EventifyApplier<Func>>(cls: Class<T>) => T,
) {
	validateGetInstance(getInstance);
	for (const [ref, eventifiedFunc] of eventifiedList) {
		const applier = getApplier(ref, getInstance!);
		if (applier) {
			applier.applyListeners(eventifiedFunc);
		}
	}
}
