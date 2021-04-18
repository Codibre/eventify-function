import { Class, Func, isClass } from 'is-this-a-pigeon';
import { Eventify } from './eventify-decorator';
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
	for (const item of Eventify) {
		const ref = item.args[0];
		const applier = getApplier(ref, getInstance!);
		if (applier) {
			applier.applyListeners(item.target[item.name as keyof Object] as any);
		}
	}
}
