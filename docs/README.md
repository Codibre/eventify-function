fluent-iterable - v0.3.0

# fluent-iterable - v0.3.0

## Table of contents

### Interfaces

- [EventifyApplier](interfaces/eventifyapplier.md)
- [FuncListeners](interfaces/funclisteners.md)
- [FunctionListener](interfaces/functionlistener.md)

### Type aliases

- [DecoratorEvents](README.md#decoratorevents)
- [EventifiedFunc](README.md#eventifiedfunc)
- [FunctionEmitter](README.md#functionemitter)

### Functions

- [applyEventify](README.md#applyeventify)
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

Ƭ **EventifiedFunc**<TFunc\>: TFunc & [*FuncListeners*](interfaces/funclisteners.md)<TFunc\>

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

### applyEventify

▸ **applyEventify**(`getInstance?`: <T\>(`cls`: *Class*<T\>) => T): *void*

#### Parameters:

Name | Type |
:------ | :------ |
`getInstance?` | <T\>(`cls`: *Class*<T\>) => T |

**Returns:** *void*

___

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
