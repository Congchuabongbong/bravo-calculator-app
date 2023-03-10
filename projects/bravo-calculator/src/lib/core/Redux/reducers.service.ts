import { Injectable } from '@angular/core';
import { Reducer } from '../data-type/type.interface';


@Injectable()
export class ReducerService<S, A> {
	private reducers: Array<Reducer<S, A>> = [];

	register (reducer: Reducer<S, A>) {
		this.reducers.push(reducer);
	}

	reduce (state: S, payload: A): S {
		return this.reducers.reduce((currentState, reducer) => reducer.reduce(currentState, payload), state);
	}
}
