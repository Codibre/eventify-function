import { Func } from 'is-this-a-pigeon';
import { applyEventify, EventifyApplier } from '../../src';
import { Eventify } from '../../src/eventify-decorator';
import * as lib from '../../src/eventify-function';
import { fName } from './setup';

describe(fName(applyEventify), () => {
	beforeEach(() => {
		jest
			.spyOn(lib, 'eventifyFunction')
			.mockImplementation((x) => `eventified ${x.name}` as any);
	});
	it('should call apply listeners for every decorated method', () => {
		interface Test {
			a: number;
		}
		const spy1 = jest.fn();
		class Listener1 implements EventifyApplier<Test['test1']> {
			applyListeners = spy1 as any;
		}
		const spy2 = jest.fn();
		class Listener2 implements EventifyApplier<Func> {
			applyListeners = spy2 as any;
		}
		const spy3 = jest.fn();
		const listener3: EventifyApplier<Func> = {
			applyListeners: spy3 as any,
		};

		class Test {
			@Eventify(Listener1)
			@Eventify(Listener2)
			@Eventify(listener3)
			test1() {
				return undefined;
			}

			@Eventify(Listener1)
			@Eventify(listener3)
			test2() {
				return undefined;
			}

			@Eventify(Listener2)
			@Eventify(listener3)
			test3() {
				return undefined;
			}
		}

		const result = applyEventify((cls) => new (cls as any)());

		expect(spy3).toHaveCallsLike(
			['eventified test1'],
			['eventified test2'],
			['eventified test3'],
		);
		expect(result).toBeUndefined();
	});

	it('should throw an error when a class listener is informed but no getInstance is', () => {
		const spy1 = jest.fn();
		class Listener1 implements EventifyApplier<Func> {
			applyListeners = spy1 as any;
		}
		class _Test {
			@Eventify(Listener1)
			test1() {
				return undefined;
			}
		}
		let thrownError: any;

		try {
			applyEventify();
		} catch (err) {
			thrownError = err;
		}

		expect(spy1).toHaveCallsLike();
		expect(thrownError).toBeInstanceOf(TypeError);
	});

	it('should do nothing when getInstance returns undefined', () => {
		const spy1 = jest.fn();
		class Listener1 implements EventifyApplier<Func> {
			applyListeners = spy1 as any;
		}
		class _Test {
			@Eventify(Listener1)
			test1() {
				return undefined;
			}
		}

		const result = applyEventify((): any => undefined);

		expect(spy1).toHaveCallsLike();
		expect(result).toBeUndefined();
	});
});
