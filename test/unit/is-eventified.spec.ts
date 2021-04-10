import { eventifyFunction, isEventified } from '../../src';

describe(isEventified.name, () => {
	it('should return true when function is eventified', () => {
		const result = isEventified(eventifyFunction(() => true));

		expect(result).toBe(true);
	});

	it('should return false when function is not eventified', () => {
		const result = isEventified(() => true);

		expect(result).toBe(false);
	});

	it('should return false when undefined is informed', () => {
		const result = isEventified(undefined);

		expect(result).toBe(false);
	});
});
