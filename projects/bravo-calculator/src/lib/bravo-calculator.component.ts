import { Component, OnInit } from '@angular/core';
import { Store } from './core/redux/store.service';
import { ReducerService } from './core/redux/reducers.service';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { Observable } from 'rxjs';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorPayload, CalculatorState } from './core/data-type/type.interface';

@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss'],
	styles: [],
})
export class BravoCalculatorComponent implements OnInit {
	public result: Observable<number> = this._calCulatorStore.selectProp('result');
	constructor(public _calCulatorStore: Store<CalculatorState, CalculatorPayload>, private _reducerService: ReducerService<CalculatorState, CalculatorPayload>, private _calculatorInvoker: CalculatorInvoker) {
		this._reducerService.register(new CalculatorReducer());
	}

	ngOnInit(): void {}
}
