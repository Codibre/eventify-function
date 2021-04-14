import { applyEventify, EventifyApplier } from '../../src';
import { Eventify } from '../../src/eventify-decorator';
import { fName } from './setup';

describe(fName(applyEventify), () => {
	it('should call apply listeners for every decorated method', () => {
		const spy1 = jest.fn();
		class Listener1 implements EventifyApplier<Object, any> {
			applyListeners = spy1 as any;
		}
		const spy2 = jest.fn();
		class Listener2 implements EventifyApplier<Object, any> {
			applyListeners = spy2 as any;
		}
		const spy3 = jest.fn();
		const listener3: EventifyApplier<Object, any> = {
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

		expect(spy1).toHaveCallsLike(
			[Test.prototype.test1],
			[Test.prototype.test2],
		);
		expect(spy2).toHaveCallsLike(
			[Test.prototype.test1],
			[Test.prototype.test3],
		);
		expect(spy3).toHaveCallsLike(
			[Test.prototype.test1],
			[Test.prototype.test2],
			[Test.prototype.test3],
		);
		expect(result).toBeUndefined();
	});

	it('should throw an error when a class listener is informed but no getInstance is', () => {
		const spy1 = jest.fn();
		class Listener1 implements EventifyApplier<Object, any> {
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
		class Listener1 implements EventifyApplier<Object, any> {
			applyListeners = spy1 as any;
		}
		class _Test {
			@Eventify(Listener1)
			test1() {
				return undefined;
			}
		}

		const result = applyEventify(() => undefined);

		expect(spy1).toHaveCallsLike();
		expect(result).toBeUndefined();
	});
});
