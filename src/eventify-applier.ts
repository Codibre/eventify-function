import { AbstractClass } from 'is-this-a-pigeon';
import { Eventify } from './eventify-decorator';
import { EventifyApplier } from './types';

export function applyEventify(
	getInstance: <T extends EventifyApplier<Object, any>>(
		cls: AbstractClass<T>,
	) => T | undefined,
) {
	for (const item of Eventify) {
		const applier = getInstance(item.args[0]);
		if (applier) {
			applier.apply(item.target[item.name as keyof Object]);
		}
	}
}
