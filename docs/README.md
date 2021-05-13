fluent-iterable - v0.5.0

# fluent-iterable - v0.5.0

## Table of contents

### Interfaces

- [EventifyApplier](interfaces/eventifyapplier.md)
- [FuncListeners](interfaces/funclisteners.md)
- [FunctionListener](interfaces/functionlistener.md)

### Type aliases

- [DecoratorEvents](README.md#decoratorevents)
- [EventifiedFunc](README.md#eventifiedfunc)
- [FunctionEmitter](README.md#functionemitter)

### Variables

- [Eventify](README.md#eventify)

### Functions

- [applyEventify](README.md#applyeventify)
- [callId](README.md#callid)
- [eventMapGet](README.md#eventmapget)
- [eventMapSet](README.md#eventmapset)
- [eventifyFunction](README.md#eventifyfunction)
- [isEventified](README.md#iseventified)

## Type aliases

### DecoratorEvents

Ƭ **DecoratorEvents**<TFunc\>: *Partial*<Events<TFunc\>\>

#### Type parameters:

| Name | Type |
| :------ | :------ |
| `TFunc` | Func |

___

### EventifiedFunc

Ƭ **EventifiedFunc**<TFunc\>: TFunc & [*FuncListeners*](interfaces/funclisteners.md)<TFunc\>

#### Type parameters:

| Name | Type |
| :------ | :------ |
| `TFunc` | Func |

___

### FunctionEmitter

Ƭ **FunctionEmitter**<TFunc\>: *TypedEventEmitter*<Events<TFunc\>\>

#### Type parameters:

| Name | Type |
| :------ | :------ |
| `TFunc` | Func |

## Variables

### Eventify

• `Const` **Eventify**: *IterableMethodDecorator*<[applierClass: EventifyApplier<Func<Args, any\>\> \| AbstractClass<EventifyApplier<Func<Args, any\>\>\>]\>

## Functions

### applyEventify

▸ **applyEventify**(`getInstance?`: <T\>(`cls`: *Class*<T\>) => T): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `getInstance?` | <T\>(`cls`: *Class*<T\>) => T |

**Returns:** *void*

___

### callId

▸ **callId**(`self`: *any*): *string*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `self` | *any* |

**Returns:** *string*

___

### eventMapGet

▸ **eventMapGet**(`id`: *string*, `key`: *string*): *unknown* \| *undefined*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `id` | *string* |
| `key` | *string* |

**Returns:** *unknown* \| *undefined*

▸ **eventMapGet**(`self`: *any*, `key`: *string*): *unknown* \| *undefined*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `self` | *any* |
| `key` | *string* |

**Returns:** *unknown* \| *undefined*

___

### eventMapSet

▸ **eventMapSet**(`id`: *string*, `key`: *string*, `value`: *unknown*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `id` | *string* |
| `key` | *string* |
| `value` | *unknown* |

**Returns:** *void*

▸ **eventMapSet**(`self`: *any*, `key`: *string*, `value`: *unknown*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `self` | *any* |
| `key` | *string* |
| `value` | *unknown* |

**Returns:** *void*

___

### eventifyFunction

▸ **eventifyFunction**<TFunc\>(`callback`: TFunc, ...`appliers`: [*EventifyApplier*](interfaces/eventifyapplier.md)<TFunc\>[]): [*EventifiedFunc*](README.md#eventifiedfunc)<TFunc\>

#### Type parameters:

| Name | Type |
| :------ | :------ |
| `TFunc` | *Func*<Args, any\> |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `callback` | TFunc |
| `...appliers` | [*EventifyApplier*](interfaces/eventifyapplier.md)<TFunc\>[] |

**Returns:** [*EventifiedFunc*](README.md#eventifiedfunc)<TFunc\>

___

### isEventified

▸ **isEventified**(`func`: *any*): func is EventifiedFunc<Func<Args, any\>\>

#### Parameters:

| Name | Type |
| :------ | :------ |
| `func` | *any* |

**Returns:** func is EventifiedFunc<Func<Args, any\>\>
