// import { Inject, Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { pluck } from 'rxjs/operators';
// import { INITIAL_STATE_CALCULATOR } from '../../init-app/token';
// import { ReducerService } from './reducers.service';

// @Injectable()
// export class Store<S, A> {
// 	private readonly state$!: BehaviorSubject<S>;

// 	constructor(private reducerService: ReducerService<S, A>, @Inject(INITIAL_STATE_CALCULATOR) private initialState: S) {
// 		this.state$ = new BehaviorSubject(this.initialState);
// 	}

// 	public dispatch(action: A) {
// 		const currentState = this.getState();
// 		const newState = this.reducerService.reduce(currentState, action);
// 		this.state$.next(newState);
// 	}

// 	public getState(): S {
// 		return this.state$.getValue();
// 	}

// 	public selectProp<K extends keyof S>(key: K): Observable<S[K]> {
// 		return this.state$.pipe(pluck(key));
// 	}
// }
