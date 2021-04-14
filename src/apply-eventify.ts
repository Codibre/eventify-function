import { Class, isClass } from 'is-this-a-pigeon';
import { Eventify } from './eventify-decorator';
import { EventifyApplier } from './types';

export function applyEventify(
	getInstance?: <T extends EventifyApplier<Object, any>>(
		cls: Class<T>,
	) => T | undefined,
) {
	for (const item of Eventify) {
		let applier: EventifyApplier<Object, any> | undefined;
		const ref = item.args[0];
		if (getInstance) {
			applier = isClass(ref) ? getInstance(ref) : ref;
		} else if (isClass(ref)) {
			throw new TypeError(
				`getInstance must be specified when Eventify decorator has received some Class reference (${item.name.toString()})`,
			);
		} else {
			applier = ref as EventifyApplier<Object, any>;
		}
		if (applier) {
			applier.applyListeners(item.target[item.name as keyof Object] as any);
		}
	}
}
