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
	@ViewChild('input', { static: true }) inputRef!: ElementRef;
	private _receiverBroadcast!: BroadcastChannel;
	public currentInput: number = 1;
	public myNumber: string = '0';
	public hostEl!: any;
	constructor(private _elementRef: ElementRef, public calculationStore: Store<ICalculatorState, ICalculatorPayload>, private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>, public calculatorInvoker: CalculatorInvoker) {
		this._calculationReducers.register(new CalculatorReducer());
		this._receiverBroadcast = new BroadcastChannel('BravoCalculatorApp');
	}

	ngAfterViewInit(): void {
		(this.inputRef.nativeElement as HTMLInputElement).readOnly = true;
	}

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
		strInput = strInput.slice(0, -1);
		event.value = strInput;
		return parseInt(strInput);
	}

	public onKeyDown(event: KeyboardEvent) {
		//**handle number pad when  here
		if (event.keyCode >= 48 && event.keyCode <= 57) {
			(this.inputRef.nativeElement as HTMLInputElement).readOnly = false;
			if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) this.inputRef.nativeElement.value = '';
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
		}

		//**Handle behavior when press backspace */

		//** Handle  */
		if (!this.calculatorInvoker.isDeleteResultDisplay) {
			if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 37 && event.keyCode <= 40)) {
				event.preventDefault();
			}
		}
		if ((this.inputRef.nativeElement.value.length == 1 || this.inputRef.nativeElement.value === '0') && event.key === 'Backspace') {
			//prevent keydown when input have length ==1 or value's = 0
			event.preventDefault();
			this.inputRef.nativeElement.value = 0;
		}
	}

	public getNumber(event: any) {
		let text = event.textContent;
		// let number = parseFloat(text.match(/\d+\.\d+/)[0]);
		console.log(text); // Hiển thị số 3.0 nếu người dùng click vào chữ 3.0
	}
}
