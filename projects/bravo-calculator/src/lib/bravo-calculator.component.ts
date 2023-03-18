import { Component, OnInit } from '@angular/core';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorAction, ICalculatorPayload, ICalculatorState } from './core/data-type/type';
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
	constructor(public calculationStore: Store<ICalculatorState, ICalculatorPayload>, private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>, public calculatorInvoker: CalculatorInvoker) {
		this._calculationReducers.register(new CalculatorReducer());
	}

	ngOnInit(): void {
		this.calculatorInvoker.addAction([1, 3, 5, 6, 7]);
	}

	public onClickHandleAdd(event: any) {
		this.calculatorInvoker.addAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result;
	}

	public onClickHandleSubtract(event: any) {
		this.calculatorInvoker.subtractAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result;
	}

	public onClickHandleMultiply(event: any) {
		this.calculatorInvoker.multiplyAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result;
	}

	public onClickHandleDivide(event: any) {
		this.calculatorInvoker.divideAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result;
	}

	public onClickEndCalculation(event: any) {
		this.calculatorInvoker.endCalculationAction(parseFloat(event.value) | 0);
		event.value = this.calculatorInvoker.result;
	}

	public onClickNumbersPad(event: any) {
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNexOperator = false;
		event.value = '7';
	}

	public onKeyDown(event: any) {
		if (!this.calculatorInvoker.isDeleteResultDisplay) {
			event.preventDefault();
		}
	}
}
