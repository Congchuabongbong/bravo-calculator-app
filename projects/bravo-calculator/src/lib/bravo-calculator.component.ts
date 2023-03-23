import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class BravoCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
	//**Declaration here */
	@ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLInputElement>;
	@ViewChild('btnBackspace', { static: true }) btnBackspaceRef!: ElementRef<HTMLButtonElement>;

	private _receiverBroadcast!: BroadcastChannel;
	public currentInput: number = 1;
	public myNumber: string = '0';
	public hostEl!: any;
	constructor(private _elementRef: ElementRef, public calculationStore: Store<ICalculatorState, ICalculatorPayload>, private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>, public calculatorInvoker: CalculatorInvoker) {
		this._calculationReducers.register(new CalculatorReducer());
		this._receiverBroadcast = new BroadcastChannel('BravoCalculatorApp');
	}

	ngAfterViewInit(): void {}

	//**Lifecycle here
	ngOnInit(): void {
		// this.__receiverBroadcast.addEventListener('message', event => {
		// 	this.calculatorInvoker.addAction(event.data);
		// });
		// this.__receiverBroadcast.postMessage([1, 2, 3, 4, 5, 6]);
	}

	ngOnDestroy(): void {
		this._receiverBroadcast.close();
	}

	//**Handle events
	public onClickHandleAdd(event: any) {
		//!!always convert to number before calculate
		this.calculatorInvoker.addAction(parseFloat(event.value));
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickHandleSubtract(event: any) {
		this.calculatorInvoker.subtractAction(parseFloat(event.value) | 0);
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickHandleMultiply(event: any) {
		this.calculatorInvoker.multiplyAction(parseFloat(event.value) | 0);
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickHandleDivide(event: any) {
		this.calculatorInvoker.divideAction(parseFloat(event.value) | 0);
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickEndCalculation(event: any) {
		this.calculatorInvoker.endCalculationAction(parseFloat(event.value) | 0);
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickNumbersPad(event: any) {
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNexOperator = false;
	}

	public onBackSpace(event: HTMLInputElement) {
		if (!this.calculatorInvoker.isDeleteResultDisplay) return;
		if (event.value.length === 1) event.value = '0';
		event.selectionEnd = event.value.length - 1;
		//handle backspace
		let strInput = event.value;
		if (strInput.length === 1) {
			return 0;
		}
		if (strInput.endsWith(' ')) strInput = strInput.trimEnd();
		strInput = strInput.slice(0, -1);
		event.value = strInput;
		return parseInt(strInput);
	}

	public onClearBtn(event: HTMLInputElement) {
		event.value = '0';
		this.calculatorInvoker.clearAction();
	}

	public onKeyDown(event: KeyboardEvent) {
		this.inputRef.nativeElement.focus();
		//**handle number pad when  here
		if (event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) {
			if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) this.inputRef.nativeElement.value = '';
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
		} else {
			event.preventDefault();
			switch (event.key) {
				case 'Escape':
					this.onClearBtn(this.inputRef.nativeElement);
					break;
				case 'Backspace':
					this.onBackSpace(this.inputRef.nativeElement);
					break;
				case '+':
					this.onClickHandleAdd(this.inputRef.nativeElement);
					break;
				case '-':
					this.onClickHandleSubtract(this.inputRef.nativeElement);
					break;
				case '*':
					this.onClickHandleMultiply(this.inputRef.nativeElement);
					break;
				case '/':
					this.onClickHandleDivide(this.inputRef.nativeElement);
					break;
				case '=':
					this.onClickEndCalculation(this.inputRef.nativeElement);
					break;
			}
		}
		//**Handle behavior when press backspace */
		// if (!this.calculatorInvoker.isDeleteResultDisplay || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 37 && event.keyCode <= 40)) {
		// 	event.preventDefault();
		// }

		// if (event.key === 'Backspace') {
		// 	if (!this.calculatorInvoker.isDeleteResultDisplay) return;
		// 	else if (this.inputRef.nativeElement.value.length === 1 || this.inputRef.nativeElement.value === '0') {
		// 		event.preventDefault();
		// 		this.inputRef.nativeElement.value = '0';
		// 	}
		// }
	}
}
