import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorAction, ICalculatorPayload, ICalculatorState } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { ThousandsSeparatorPipe } from './shared/pipes/thousandsSeparator.format';
import { unformattedNumber } from './shared/utils';
import { formatNumber } from './shared/utils/functions.util';
import { Tooltip, PopupPosition } from '@grapecity/wijmo';
@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss'],
	styles: [],
	providers: [ThousandsSeparatorPipe],
})
export class BravoCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
	//**Declaration here */
	@ViewChild('input', { static: true }) inputRef!: ElementRef<HTMLTextAreaElement>;
	@ViewChild('calculatorHistories', { static: true }) calculatorHistoriesRef!: ElementRef<HTMLDivElement>;
	@Input() initEmitValue!: number[];
	@Input() titleTooltipHistories: string = 'Click đúp chuột vào một số bất kỳ để lấy giá trị số đó cho máy tính';
	private _receiverBroadcast!: BroadcastChannel;
	public inputVal: string = '0';
	private _regexDigit = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	private _tooltipHistories!: Tooltip;

	constructor(
		public calculationStore: Store<ICalculatorState, ICalculatorPayload>,
		private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>,
		public calculatorInvoker: CalculatorInvoker,
		private thousandsSeparator: ThousandsSeparatorPipe,
	) {
		this._calculationReducers.register(new CalculatorReducer());
		this._receiverBroadcast = new BroadcastChannel('BravoCalculatorApp');
		if (this.initEmitValue) {
			this.calculatorInvoker.addAction(this.initEmitValue);
			this.inputRef.nativeElement.value = this.calculatorInvoker.result.toString();
		}
	}

	ngAfterViewInit(): void {
		this._receiverBroadcast.addEventListener('message', event => {
			this.calculatorInvoker.addAction(event.data);
			this.inputRef.nativeElement.value = this.calculatorInvoker.result.toString();
		});
		this._tooltipHistories = new Tooltip();
		this._tooltipHistories.setTooltip(this.calculatorHistoriesRef.nativeElement, this.titleTooltipHistories, PopupPosition.BelowRight);
		this._tooltipHistories.cssClass = 'tooltip-histories';
		this._tooltipHistories.showDelay = 510;
		this._tooltipHistories.isAnimated = true;
		this._tooltipHistories.gap = 0;
	}

	//**Lifecycle here
	ngOnInit(): void {}

	ngOnDestroy(): void {
		this._receiverBroadcast.close();
		this._tooltipHistories.dispose();
	}

	//**Handle events
	public onClickHandleAdd(event: HTMLTextAreaElement) {
		this.calculatorInvoker.addAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickHandleSubtract(event: HTMLTextAreaElement) {
		this.calculatorInvoker.subtractAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickHandleMultiply(event: HTMLTextAreaElement) {
		this.calculatorInvoker.multiplyAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickHandleDivide(event: HTMLTextAreaElement) {
		this.calculatorInvoker.divideAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickEndCalculation(event: HTMLTextAreaElement) {
		this.calculatorInvoker.endCalculationAction(unformattedNumber(event.value));
		!this.calculatorInvoker.isDeleteResultDisplay && (event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString()));
	}

	public onClickNumbersPad(event: string): void {
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) this.inputRef.nativeElement.value = '';
		this.inputRef.nativeElement.value = this.thousandsSeparator.transform((this.inputRef.nativeElement.value += event));
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNexOperator = false;
	}

	public onBackSpace(event: HTMLTextAreaElement): void {
		if (!this.calculatorInvoker.isDeleteResultDisplay) return;
		if (event.value.length === 1) event.value = '0';
		event.selectionEnd = event.value.length - 1;
		//handle backspace
		let strInput = event.value;
		if (strInput.length === 1) {
			return;
		}
		if (strInput.endsWith(' ')) strInput = strInput.trimEnd();
		strInput = strInput.slice(0, -1);
		event.value = strInput.trimEnd();
	}

	public onClearBtn(event: HTMLTextAreaElement) {
		event.value = '0';
		this.calculatorInvoker.clearAction();
		event.focus();
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
			this.inputRef.nativeElement.value = this.thousandsSeparator.transform(selObj.toString().trim());
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
		}
	}

	private _handleActiveBtn(key: number | string) {
		if (typeof key === 'number') {
			switch (key) {
				case 49:
					break;

				default:
					break;
			}
		} else {
		}
	}

	public generateSuggest(event: HTMLTextAreaElement) {
		const numberUnformatted = unformattedNumber(event.value);
		const numberSuggest1x = (numberUnformatted * 10).toString();
		const numberSuggest3x = (numberUnformatted * 1000).toString();
		const numberSuggest4x = (numberUnformatted * 10000).toString();
	}
}
