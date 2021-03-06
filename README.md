[![Actions Status](https://github.com/Codibre/eventify-function/workflows/build/badge.svg)](https://github.com/Codibre/eventify-function/actions)
[![Actions Status](https://github.com/Codibre/eventify-function/workflows/test/badge.svg)](https://github.com/Codibre/eventify-function/actions)
[![Actions Status](https://github.com/Codibre/eventify-function/workflows/lint/badge.svg)](https://github.com/Codibre/eventify-function/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ca2701c00154ed24d401/test_coverage)](https://codeclimate.com/github/Codibre/eventify-function/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ca2701c00154ed24d401/maintainability)](https://codeclimate.com/github/Codibre/eventify-function/maintainability)
[![Packages](https://david-dm.org/Codibre/eventify-function.svg)](https://david-dm.org/Codibre/eventify-function)
[![npm version](https://badge.fury.io/js/eventify-function.svg)](https://badge.fury.io/js/eventify-function)

A package that adds to any given function or method events of starting, ending and erroring

# How to install

```
npm i eventify-function
```

# How to use

Just call **eventifyFunction** informing the function you want to eventify

```ts
const eventified = eventifyFunction(myFunction);
```

A new version of the function is returned that does exactly what the former one does, but it also emits event when:
* When the function is called: **init**;
* When the function ends: **end**;
* In case the function returns an Iterable or AsyncIterable with no size or length property, it emits an event when the iteration ends: **iterated**;
* When the function throws an error: **error**

Look that, a **string**, an **Array**, a **Map**, a **WeakMap**, a **Set** and a **WeakSet** are all valid iterables, but if your function return or resolve for one of those types, **end** will be called instead of **iterated**. That's because all these types don't need iteration to be evaluated. A **Generator**, in the other hand, does.
Notice that **streams** are also **AsyncIterables**, and a stream need iteration to be evaluated. In that case, if you eventify a function that returns a String, it'll not emit **end**, just **iterated** when the streams close.

To listen to some of the events, you attach a listener to it as with any other EventEmitter:

```ts
eventified.on('init', (uuid: string, a: Number, b: string) => console.log(`(${uuid}): myFunction was called with "${a}" and "${b}"`);
eventified.on('end', (uuid: string, result: boolean, a: Number, b: string) => console.log(`(${uuid}): myFunction returned "${result}" for the call with "${a}" and ${b}"`);
eventified.on('error', (uuid: string, err: Error, a: Number, b: string) => console.log(`(${uuid}): myFunction threw "${err.Message}" for the call with "${a}" and "${b}"`);
eventified.on('iterated', (uuid: string, a: Number, b: string) => console.log(`(${uuid}): Iteration ended for the call with "${a}" and "${b}"`);
eventified.on('yielded', (uuid: string, value: boolean; a: Number, b: string) => console.log(`(${uuid}): Iteration yielded: ${value} for the call with "${a}" and "${b}"`);
```

Notice that all the events are strongly typed and receives the parameters passed to the function, while **end** additionally receives the result, and **error** the threw Error.
The event **iterated** does not receives the result as, for an iterable, there is multiples, but you can access each yielded value by the **yielded** event.
Finally, there is an uuid generated for each call, so, you can identify each call flow.


# Using decorators

You can also easily eventify methods decorating them! To take this approach, do as follow:


```ts
class MyClass {
  @Eventify(MyEventApplier)
  test(test: string, index: number): void {
    ...
  }
}
```

In this example, **MyEventApplier** must implement **EventifyApplier<F extends Func>**, using the decorated method as signature:

```ts
class MyEventApplier implements EventifyApplier<MyClass['test']s> {
  applyListeners(eventified: EventifiedFunc<MyClass['test']>) {
    eventified.on('end', (uuid: string, result: void, test: string, index: number) => {
      console.log(`${uuid}: ("${test}", ${index}) call ended`);
    });
  }
}
```

Finally, to initialize the appliers, you must call **applyEventify** informing instance getter function:

```ts
applyEventify(() => new MyEventApplier());
```

The instance getter function is needed because **eventify-function** does not have control of the right way to instantiate your applier classes. The idea here is for you to use some dependency injection package for it.
If you don't have such complexity and want to avoid using **applyEventify**, you can inform to the decorator directly an instance of your class:

```ts
class MyClass {
  @Eventify(new MyEventApplier())
  test(test: string, index: number): void {
    ...
  }
}
```

Using it like this, the applier will be used immediately.

## Sharing values between event listeners and eventified methods

Let's suppose, in your method, you have an intermediate value that is useful in your error event, for some logging purpose. The error event only have access to the error parameters, but not any information limited to the function scope, so, how do you do it?

The first way to achieve this is to aggregate the information you want in the parameters the function received, before the error happens. This way, when the parameters are passed to the error event, it'll have the additional info. But what if you don't want to pollute your parameters?

in this, case, there is some special functions you may call **just inside the eventified method** that'll help you out:

```ts
class MyTest() {
  constructor(private logger: Logger) {}

  @Eventify(MyErrorHandler)
  async myMethod(value: string, index: number) {
    const id = await getIndexId(index);
    // The callId function will return the call id passed to the events!
    this.logger.info(`index id ${id} received for ${callId(this)}`);
    // The eventMapSet will put any information you want in a temporary context available while your method is running
    eventMapSet('index-id', id);

    await doSomethingElse(id, value);
  }
}
```

Then, to access your information from your event, you can do as follow:

```ts
class MyErrorHandler implements EventifyApplier<MyTest['myMethod']s> {
  constructor(private logger: Logger) {}

  applyListeners(eventified: EventifiedFunc<MyTest['myMethod']>) {
    eventified.on('error', (uuid: string, error: Error, test: string, index: number) => {
      this.logger.error(`${uuid}: an error occurred for index id ${eventMapGet(uuid, 'index-id')}: ${error.message}`);
    });
  }
}
```

That's it! But be aware! This  information is highly temporary and, if you want to access if in the **error**, **end** or **iterated** event, you need to do it immediately in the event listener, before any promise awaiting or then operation, otherwise the information may already have been dropped.

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
