import { getUniqueId } from '../../src/get-unique-id';
import { fName } from './setup';
import { interval } from '@codibre/fluent-iterable';

describe(fName(getUniqueId), () => {
	it('should return a different value for each call', () => {
    const total = 1000000;
		const result = interval(1, total)
			.map(() => getUniqueId())
			.distinct()
			.count();

		expect(result).toBe(total);
	});
});
