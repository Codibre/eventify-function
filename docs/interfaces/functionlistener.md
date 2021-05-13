[fluent-iterable - v0.5.4](../README.md) / FunctionListener

# Interface: FunctionListener<TFunc\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TFunc` | Func |

## Callable

▸ **FunctionListener**<E\>(`event`: E, `listener`: *Events*<TFunc\>[E]): [*FunctionEmitter*](../README.md#functionemitter)<TFunc\>

#### Type parameters:

| Name | Type |
| :------ | :------ |
| `E` | keyof *Events*<TFunc\> |

#### Parameters:

| Name | Type |
| :------ | :------ |
| `event` | E |
| `listener` | *Events*<TFunc\>[E] |

**Returns:** [*FunctionEmitter*](../README.md#functionemitter)<TFunc\>
