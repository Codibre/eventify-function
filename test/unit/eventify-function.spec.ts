const v4 = jest.fn().mockReturnValue('uuid value');
jest.mock('uuid', () => ({ v4 }));
import { identity } from 'is-this-a-pigeon';
import { eventifyFunction } from '../../src';
import './setup';

describe(eventifyFunction.name, () => {
	it('should only eventify once', () => {
		const callback = () => 1;

		const result1 = eventifyFunction(callback);
		const result2 = eventifyFunction(result1);

		expect(result1).toBe(result2);
	});

	it('should properly eventify functions that returns a simple value', () => {
		function test(..._args: any[]) {
			return '123';
		}
		const onInit = jest.fn();
		const onEnd = jest.fn();

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.once('end', onEnd);
		const result = eventified('a', 1, false);

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(onEnd).toHaveCallsLike(['uuid value', '123', 'a', 1, false]);
		expect(result).toBe('123');
	});

	it('should properly eventify functions that throws an error', () => {
		const err = new Error('my error');
		function test(..._args: any[]) {
			throw err;
		}
		const onInit = jest.fn();
		const onError = jest.fn();
		let thrownError: any;

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.once('error', onError);
		try {
			eventified('a', 1, false);
		} catch (error) {
			thrownError = error;
		}

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(onError).toHaveCallsLike(['uuid value', err, 'a', 1, false]);
		expect(thrownError).toBe(err);
	});
	it('should properly eventify functions that resolves a simple value', async () => {
		const expected = new Map();
		const checkCall = jest.fn().mockImplementation(identity);
		function test(..._args: any[]) {
			return Promise.resolve(expected).then(checkCall);
		}
		const onInit = jest.fn();
		const onEnd = jest.fn();

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.once('end', onEnd);
		const result = await eventified('a', 1, false);

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(checkCall).toHaveCallsLike([expected]);
		expect(onEnd).toHaveBeenCalledAfter(checkCall);
		expect(onEnd).toHaveCallsLike(['uuid value', expected, 'a', 1, false]);
		expect(result).toBe(expected);
	});

	it('should properly eventify functions that rejects an error', async () => {
		const err = new Error('my error');
		const checkCall = jest.fn().mockImplementation(identity);
		function test(..._args: any[]) {
			return Promise.resolve()
				.then(checkCall)
				.then(() => Promise.reject(err));
		}
		const onInit = jest.fn();
		const onError = jest.fn();
		let thrownError: any;

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.once('error', onError);
		try {
			await eventified('a', 1, false);
		} catch (error) {
			thrownError = error;
		}

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(checkCall).toHaveCallsLike([undefined]);
		expect(onError).toHaveBeenCalledAfter(checkCall);
		expect(onError).toHaveCallsLike(['uuid value', err, 'a', 1, false]);
		expect(thrownError).toBe(err);
	});

	it('should properly eventify functions that returns an iterable', () => {
		const checkCall = jest.fn().mockImplementation(identity);
		function* test(..._args: any[]) {
			yield 1;
			yield 2;
			yield 3;
			checkCall();
		}
		const onInit = jest.fn();
		const onYielded = jest.fn();
		const onIterated = jest.fn();

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.on('yielded', onYielded);
		eventified.once('iterated', onIterated);
		const result = Array.from(eventified('a', 1, false));

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(onYielded).toHaveCallsLike(
			['uuid value', 1, 'a', 1, false],
			['uuid value', 2, 'a', 1, false],
			['uuid value', 3, 'a', 1, false],
		);
		expect(checkCall).toHaveCallsLike([]);
		expect(onIterated).toHaveBeenCalledAfter(checkCall);
		expect(onIterated).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(result).toEqual([1, 2, 3]);
	});

	it('should properly eventify generator functions that throws an error', async () => {
		const checkCall = jest.fn().mockImplementation(identity);
		const err = new Error('my error');
		function* test(..._args: any[]) {
			yield 1;
			yield 2;
			checkCall();
			throw err;
		}
		const onInit = jest.fn();
		const onYielded = jest.fn();
		const onError = jest.fn();
		let thrownError: any;

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.on('yielded', onYielded);
		eventified.once('error', onError);
		try {
			Array.from(eventified('a', 1, false));
		} catch (error) {
			thrownError = error;
		}

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(onYielded).toHaveCallsLike(
			['uuid value', 1, 'a', 1, false],
			['uuid value', 2, 'a', 1, false],
		);
		expect(checkCall).toHaveCallsLike([]);
		expect(onError).toHaveBeenCalledAfter(checkCall);
		expect(onError).toHaveCallsLike(['uuid value', err, 'a', 1, false]);
		expect(thrownError).toBe(err);
	});

	it('should properly eventify functions that returns an async iterable', async () => {
		const checkCall = jest.fn().mockImplementation(identity);
		async function* test(..._args: any[]) {
			yield 1;
			yield 2;
			yield 3;
			checkCall();
		}
		const onInit = jest.fn();
		const onYielded = jest.fn();
		const onIterated = jest.fn();

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.on('yielded', onYielded);
		eventified.once('iterated', onIterated);
		const result = new Array<any>();
		for await (const item of eventified('a', 1, false)) {
			result.push(item);
		}

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(onYielded).toHaveCallsLike(
			['uuid value', 1, 'a', 1, false],
			['uuid value', 2, 'a', 1, false],
			['uuid value', 3, 'a', 1, false],
		);
		expect(checkCall).toHaveCallsLike([]);
		expect(onIterated).toHaveBeenCalledAfter(checkCall);
		expect(onIterated).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(result).toEqual([1, 2, 3]);
	});

	it('should properly eventify async generator functions that throws an error', async () => {
		const checkCall = jest.fn().mockImplementation(identity);
		const err = new Error('my error');
		async function* test(..._args: any[]) {
			yield 1;
			yield 2;
			checkCall();
			throw err;
		}
		const onInit = jest.fn();
		const onYielded = jest.fn();
		const onError = jest.fn();
		let thrownError: any;

		const eventified = eventifyFunction(test);
		eventified.once('init', onInit);
		eventified.on('yielded', onYielded);
		eventified.once('error', onError);
		const result = new Array<any>();
		try {
			for await (const item of eventified('a', 1, false)) {
				result.push(item);
			}
		} catch (error) {
			thrownError = error;
		}

		expect(v4).toHaveCallsLike([]);
		expect(onInit).toHaveCallsLike(['uuid value', 'a', 1, false]);
		expect(onYielded).toHaveCallsLike(
			['uuid value', 1, 'a', 1, false],
			['uuid value', 2, 'a', 1, false],
		);
		expect(checkCall).toHaveCallsLike([]);
		expect(onError).toHaveBeenCalledAfter(checkCall);
		expect(onError).toHaveCallsLike(['uuid value', err, 'a', 1, false]);
		expect(thrownError).toBe(err);
		expect(result).toEqual([1, 2]);
	});
});
