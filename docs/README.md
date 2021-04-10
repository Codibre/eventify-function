fluent-iterable - v0.1.1

# fluent-iterable - v0.1.1

## Table of contents

### Interfaces

- [FunctionListener](interfaces/functionlistener.md)

### Type aliases

- [DecoratorEvents](README.md#decoratorevents)
- [EventifiedFunc](README.md#eventifiedfunc)
- [FunctionEmitter](README.md#functionemitter)

### Functions

- [eventifyFunction](README.md#eventifyfunction)
- [isEventified](README.md#iseventified)

## Type aliases

### DecoratorEvents

Ƭ **DecoratorEvents**<TFunc\>: *Partial*<Events<TFunc\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`TFunc` | Func |

___

### EventifiedFunc

Ƭ **EventifiedFunc**<TFunc\>: TFunc & { `off`: [*FunctionListener*](interfaces/functionlistener.md)<TFunc\> ; `on`: [*FunctionListener*](interfaces/functionlistener.md)<TFunc\> ; `once`: [*FunctionListener*](interfaces/functionlistener.md)<TFunc\>  }

#### Type parameters:

Name | Type |
:------ | :------ |
`TFunc` | Func |

___

### FunctionEmitter

Ƭ **FunctionEmitter**<TFunc\>: *TypedEventEmitter*<Events<TFunc\>\>

#### Type parameters:

Name | Type |
:------ | :------ |
`TFunc` | Func |

## Functions

### eventifyFunction

▸ **eventifyFunction**<TFunc\>(`callback`: TFunc): [*EventifiedFunc*](README.md#eventifiedfunc)<TFunc\>

#### Type parameters:

Name | Type |
:------ | :------ |
`TFunc` | *Func*<Args, any\> |

#### Parameters:

Name | Type |
:------ | :------ |
`callback` | TFunc |

**Returns:** [*EventifiedFunc*](README.md#eventifiedfunc)<TFunc\>

___

### isEventified

▸ **isEventified**(`func`: *any*): func is EventifiedFunc<Func<Args, any\>\>

#### Parameters:

Name | Type |
:------ | :------ |
`func` | *any* |

**Returns:** func is EventifiedFunc<Func<Args, any\>\>
