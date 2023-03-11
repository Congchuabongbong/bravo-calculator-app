import { Injectable } from '@angular/core';
import { IReducer } from '../data-type/type';

@Injectable()
export class ReducerService<S, A> {
	private reducers: Array<IReducer<S, A>> = [];

	register(IReducer: IReducer<S, A>) {
		this.reducers.push(IReducer);
	}

	reduce(state: S, payload: A): S {
		return this.reducers.reduce((currentState, IReducer) => IReducer.reduce(currentState, payload), state);
	}
}
