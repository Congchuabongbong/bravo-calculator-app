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
	constructor(public calCulatorStore: Store<ICalculatorState, CalculatorPayload>, private _reducerService: ReducerService<ICalculatorState, CalculatorAction>, public calculatorInvoker: CalculatorInvoker) {
		this._reducerService.register(new CalculatorReducer());
	}

	ngOnInit(): void {
		this.calculatorInvoker.addAction([1, 4, 14, 457]);
	}

	public onClickHandleAdd(event: HTMLInputElement) {
		this.calculatorInvoker.addAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result.toString();
	}

	public onClickHandleSubtract(event: HTMLInputElement) {
		this.calculatorInvoker.subtractAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result.toString();
	}

	public onClickHandleMultiply(event: HTMLInputElement) {
		this.calculatorInvoker.multiplyAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result.toString();
	}

	public onClickHandleDivide(event: HTMLInputElement) {
		this.calculatorInvoker.divideAction(parseFloat(event.value));
		event.value = this.calculatorInvoker.result.toString();
	}

	public onClickEndCalculation() {
		this.calculatorInvoker.endCalculationAction();
	}

	public onClickNumbersPad(event: HTMLInputElement) {
		this.calculatorInvoker.setIsNexOperator(false);
		event.value = '7';
	}
}
