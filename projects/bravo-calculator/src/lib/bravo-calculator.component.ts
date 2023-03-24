import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorAction, ICalculatorPayload, ICalculatorState } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { ThousandsSeparatorPipe } from './shared/pipes/thousandsSeparator.format';
import { unformattedNumber } from './shared/utils';

@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss'],
	styles: [],
})
export class BravoCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
	//**Declaration here */
	@ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLTextAreaElement>;
	private _receiverBroadcast!: BroadcastChannel;
	public inputVal: string = '0';
	private _regexDigit = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	constructor(
		public calculationStore: Store<ICalculatorState, ICalculatorPayload>,
		private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>,
		public calculatorInvoker: CalculatorInvoker,
		private thousandsSeparator: ThousandsSeparatorPipe,
	) {
		this._calculationReducers.register(new CalculatorReducer());
		this._receiverBroadcast = new BroadcastChannel('BravoCalculatorApp');
	}

	ngAfterViewInit(): void {
		this._receiverBroadcast.addEventListener('message', event => {
			this.calculatorInvoker.addAction(event.data);
			this.inputRef.nativeElement.value = this.calculatorInvoker.result.toString();
		});
	}

	//**Lifecycle here
	ngOnInit(): void {}

	ngOnDestroy(): void {
		this._receiverBroadcast.close();
	}

	//**Handle events
	public onClickHandleAdd(event: any) {
		this.calculatorInvoker.addAction(unformattedNumber(event.value));
		event.value = this.calculatorInvoker.result;
	}

	public onClickHandleSubtract(event: any) {
		this.calculatorInvoker.subtractAction(unformattedNumber(event.value));
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickHandleMultiply(event: any) {
		this.calculatorInvoker.multiplyAction(unformattedNumber(event.value));
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickHandleDivide(event: any) {
		this.calculatorInvoker.divideAction(unformattedNumber(event.value));
		this.calculatorInvoker.isNexOperator && (event.value = this.calculatorInvoker.result);
	}

	public onClickEndCalculation(event: any) {
		this.calculatorInvoker.endCalculationAction(unformattedNumber(event.value));
		!this.calculatorInvoker.isDeleteResultDisplay && (event.value = this.calculatorInvoker.result);
	}

	public onClickNumbersPad(event: any) {
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) this.inputRef.nativeElement.value = '';
		this.inputRef.nativeElement.value = this.thousandsSeparator.transform((this.inputRef.nativeElement.value += event));
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNexOperator = false;
	}

	public onBackSpace(event: HTMLTextAreaElement) {
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
		event.value = strInput.trimEnd();
		return parseInt(strInput);
	}

	public onClearBtn(event: HTMLTextAreaElement) {
		event.value = '0';
		this.calculatorInvoker.clearAction();
	}

	public onDecimalBtn(event: HTMLTextAreaElement) {
		if (event.value === '0') {
			event.value += '.';
			this.calculatorInvoker.isDeleteResultDisplay = true;
		} else if (!event.value.includes('.')) {
			event.value += '.';
			this.calculatorInvoker.isDeleteResultDisplay = true;
		}
		event.focus();
	}

	public onAbs(event: HTMLTextAreaElement) {
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) return;
		event.value = event.value.startsWith('-') ? event.value.replace('-', '') : '-'.concat(event.value);
		event.focus();
	}

	public onKeyDownCalculatorContainer(event: KeyboardEvent) {
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
				case '.':
					this.onDecimalBtn(this.inputRef.nativeElement);
					break;
			}
		}
	}

	public onHandleClickCalculatorContainer(event: MouseEvent): void {
		if (!(event.target as HTMLElement).classList.contains('histories-expression')) return;
		const selObj = window.getSelection();
		if (selObj && this._regexDigit.test(selObj.toString().trim())) {
			this.inputRef.nativeElement.value = selObj.toString().trim();
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
		}
	}
}
