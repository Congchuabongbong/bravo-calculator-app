import { Component, OnInit } from '@angular/core';
import { CalculatorInvoker } from './core/command/invoker.service';
import { EOperatorString } from './core/data-type/enum';
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
	constructor(public _calCulatorStore: Store<ICalculatorState, CalculatorPayload>, private _reducerService: ReducerService<ICalculatorState, CalculatorAction>, public calculatorInvoker: CalculatorInvoker) {
		this._reducerService.register(new CalculatorReducer());
	}

	ngOnInit(): void {}

	onHandleAdd(event: HTMLInputElement) {
		this.calculatorInvoker.setCurrentOperator(EOperatorString.Addition);
		if (event.value) {
			this.calculatorInvoker.add(parseFloat(event.value));
			event.focus();
			event.value = this.calculatorInvoker.result.toString();
		} else {
			this.calculatorInvoker.switchOperator();
		}
	}

	onHandleSubtract(event: HTMLInputElement) {
		if (event.value) {
			event.focus();
			event.value = this.calculatorInvoker.result.toString();
		}
	}

	onHandleMultiply(event: HTMLInputElement) {
		if (event.value) {
			event.focus();
			event.value = this.calculatorInvoker.result.toString();
		}
	}

	onHandleDivide(event: HTMLInputElement) {
		this.calculatorInvoker.setCurrentOperator(EOperatorString.Division);
		if (event.value) {
			this.calculatorInvoker.divide(parseFloat(event.value));
			event.focus();
			event.value = this.calculatorInvoker.result.toString();
		} else {
			this.calculatorInvoker.switchOperator();
		}
	}
}
