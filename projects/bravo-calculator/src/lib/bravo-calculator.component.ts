import { Component, OnInit } from '@angular/core';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorAction, CalculatorPayload, ICalculatorState } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { EInputAction } from './core/data-type/enum';

@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss'],
	styles: [],
})
export class BravoCalculatorComponent implements OnInit {
	constructor(public _calCulatorStore: Store<ICalculatorState, CalculatorPayload>, private _reducerService: ReducerService<ICalculatorState, CalculatorAction>, private _calculatorInvoker: CalculatorInvoker) {
		this._reducerService.register(new CalculatorReducer());
	}

	ngOnInit(): void {
		this._calculatorInvoker.add([1, 2, 4, 5, 6], EInputAction.Select);
		this._calculatorInvoker.add([1, 2, 4, 5, 6], EInputAction.Select);
		this._calculatorInvoker.endCalculation();
		this._calculatorInvoker.add(12);
		this._calculatorInvoker.add([1, 2, 4, 5, 6], EInputAction.Select);
		this._calculatorInvoker.endCalculation();

		console.log(this._calculatorInvoker.calculationHistories);
	}
}
