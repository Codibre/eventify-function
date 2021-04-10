import { Func } from 'is-this-a-pigeon';
import { eventified } from './symbol';
import { EventifiedFunc } from './types';

export function isEventified(func: any): func is EventifiedFunc<Func> {
	return !!func?.[eventified];
}
