import { Component, OnInit } from '@angular/core';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorAction, CalculatorPayload, ICalculatorState } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';

@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss'],
	styles: [],
})
export class BravoCalculatorComponent implements OnInit {
	constructor(public _calCulatorStore: Store<ICalculatorState, CalculatorPayload>, private _reducerService: ReducerService<ICalculatorState, CalculatorAction>, private calculatorInvoker: CalculatorInvoker) {
		this._reducerService.register(new CalculatorReducer());
	}

	ngOnInit(): void {
		this.calculatorInvoker.add([1, 2, 3, 4, 5, 6, 7, 7]);
		this.calculatorInvoker.add([1, 2, 3, 4, 5, 6, 7, 7]);
		this.calculatorInvoker.divide(35);
		this.calculatorInvoker.endCalculation();
		// this.calculatorInvoker.add([1, 2, 3, 4, 5, 6, 7, 7]);
		// this.calculatorInvoker.add([1, 2, 3, 4, 5, -6, 7, -7]);
		// this.calculatorInvoker.endCalculation();
		// this.calculatorInvoker.add();
		// this.calculatorInvoker.add(2000);
		// this.calculatorInvoker.endCalculation();
	}
}
