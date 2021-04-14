import 'jest-callslike';
import 'jest-extended';

afterEach(() => {
	jest.restoreAllMocks();
	jest.clearAllMocks();
});

export function fName(result: Function): any {
	return `${result}`;
}

export function getNames<T extends object>(c: { prototype: T }): T {
	return new Proxy(c.prototype, {
		get(target: T, property: string) {
			const result = target[property as keyof T];
			if (!result) {
				throw new Error(`Method ${property} doesn't exist`);
			}

			return `.${fName(result as any)}`;
		},
	});
}
