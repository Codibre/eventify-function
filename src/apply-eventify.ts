import { Class, Func, isClass } from 'is-this-a-pigeon';
import { Eventify } from './eventify-decorator';
import { EventifyApplier } from './types';

export function applyEventify(
	getInstance?: <T extends EventifyApplier<Func>>(cls: Class<T>) => T,
) {
	if (!getInstance) {
		throw new TypeError('getInstance must be specified');
	}
	for (const item of Eventify) {
		const ref = item.args[0];
		const applier = isClass(ref) ? getInstance(ref) : undefined;
		if (applier) {
			applier.applyListeners(item.target[item.name as keyof Object] as any);
		}
	}
}
