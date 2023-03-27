import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, Renderer2 } from '@angular/core';
import { PopupPosition, Tooltip } from '@grapecity/wijmo';
import { CalculatorInvoker } from './core/command/invoker.service';
import { CalculatorAction, ICalculatorPayload, ICalculatorState, OptionsMenu } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';
import { ThousandsSeparatorPipe } from './shared/pipes/thousandsSeparator.format';
import { unformattedNumber } from './shared/utils';
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

	@ViewChild('btnMenu', { static: true }) btnMenuRef!: ElementRef<HTMLSpanElement>;
	@ViewChild('calculatorHistories', { static: true }) calculatorHistoriesRef!: ElementRef<HTMLDivElement>;
	@ViewChildren('btn') btnRef!: QueryList<ElementRef<HTMLButtonElement>>;
	@Input() titleTooltipHistories: string = 'Click đúp chuột vào một số bất kỳ để lấy giá trị số đó cho máy tính';
	@Input() initEmitValue!: number[];
	private _receiverBroadcast!: BroadcastChannel;
	public inputVal: string = '0';
	private readonly _regexDigit = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	private _tooltipHistories!: Tooltip;
	private readonly _btnMap = [
		{ key: '1', class: 'btn--1' },
		{ key: '2', class: 'btn--2' },
		{ key: '3', class: 'btn--3' },
		{ key: '4', class: 'btn--4' },
		{ key: '5', class: 'btn--5' },
		{ key: '6', class: 'btn--6' },
		{ key: '7', class: 'btn--7' },
		{ key: '8', class: 'btn--8' },
		{ key: '9', class: 'btn--9' },
		{ key: 'Escape', class: 'btn--clear' },
		{ key: 'Backspace', class: 'btn--backspace' },
		{ key: '+', class: 'btn--add' },
		{ key: '-', class: 'btn--subtract' },
		{ key: '*', class: 'btn--multiple' },
		{ key: '/', class: 'btn--divide' },
		{ key: '=', class: 'btn--equal' },
		{ key: '.', class: 'btn--decimal' },
		{ key: 'abs', class: 'btn--abs' },
	];

	@Input('menuOptions') menuCommandOptions: OptionsMenu[] = [
		{
			descCmd: 'Tùy chọn khi bấm phím Enter',
			keyCmd: 'Enter',
			optionsCmd: [
				{ value: true, name: 'Không', group: 0 },
				{ value: false, name: 'Xóa tất cả', group: 1 },
				{ value: false, name: 'Xóa', group: 1 },
				{ value: false, name: 'Thu nhỏ máy tính', group: 2 },
				{ value: false, name: 'Chuyển cửa sổ', group: 2 },
				{ value: false, name: 'Tính', group: 3 },
				{ value: false, name: 'Tính và dán kết quả', group: 3 },
			],
		},
		{
			descCmd: 'Tùy chọn khi bấm phím Esc',
			keyCmd: 'Escape',
			optionsCmd: [
				{ value: true, name: 'Không', group: 0 },
				{ value: false, name: 'Xóa tất cả', group: 1 },
				{ value: false, name: 'Xóa', group: 1 },
				{ value: false, name: 'Thu nhỏ máy tính', group: 2 },
				{ value: false, name: 'Chuyển cửa sổ', group: 2 },
				{ value: false, name: 'Tính', group: 3 },
				{ value: false, name: 'Tính và dán kết quả', group: 3 },
			],
		},
	];

	public menuMultipleSelect!: MenuMultipleSelectComponent;
	//**Constructor here */
	constructor(
		private _elRef: ElementRef,
		public calculationStore: Store<ICalculatorState, ICalculatorPayload>,
		private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>,
		public calculatorInvoker: CalculatorInvoker,
		private thousandsSeparator: ThousandsSeparatorPipe,
		private componentFactoryResolver: ComponentFactoryResolver,
	) {
		this._calculationReducers.register(new CalculatorReducer());
		this._receiverBroadcast = new BroadcastChannel('BravoCalculatorApp');
		if (this.initEmitValue) {
			this.calculatorInvoker.addAction(this.initEmitValue);
			this.inputRef.nativeElement.value = this.calculatorInvoker.result.toString();
		}
		// const newWindow = window.open('http://localhost:4200/', 'Example', 'width=500,height=300');
	}

	ngAfterViewInit(): void {
		this._receiverBroadcast.addEventListener('message', event => {
			this.calculatorInvoker.addAction(event.data);
			this.inputRef.nativeElement.value = this.calculatorInvoker.result.toString();
		});
		this._handleActiveBtn('Escape');
		this._initTooltip();
	}

	//**Lifecycle here
	ngOnInit(): void {}

	ngOnDestroy(): void {
		this._receiverBroadcast.close();
		this._tooltipHistories.dispose();
	}

	private _initTooltip(): void {
		this._tooltipHistories = new Tooltip();
		this._tooltipHistories.setTooltip(this.calculatorHistoriesRef.nativeElement, this.titleTooltipHistories, PopupPosition.BelowRight);
		this._tooltipHistories.cssClass = 'tooltip-histories';
		this._tooltipHistories.showDelay = 510;
		this._tooltipHistories.isAnimated = true;
		this._tooltipHistories.gap = 0;
	}

	//**Handle events
	public onClickHandleAddBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('+');
		this.calculatorInvoker.addAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickHandleSubtractBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('-');
		this.calculatorInvoker.subtractAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickHandleMultiplyBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('*');
		this.calculatorInvoker.multiplyAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickHandleDivideBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('/');
		this.calculatorInvoker.divideAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString());
	}

	public onClickEndCalculationBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('=');
		this.calculatorInvoker.endCalculationAction(unformattedNumber(event.value));
		!this.calculatorInvoker.isDeleteResultDisplay && (event.value = this.thousandsSeparator.transform(this.calculatorInvoker.result.toString()));
	}

	public onClickNumbersPadBtn(event: string): void {
		this._handleActiveBtn(event);
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) this.inputRef.nativeElement.value = '';
		this.inputRef.nativeElement.value = this.thousandsSeparator.transform((this.inputRef.nativeElement.value += event));
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNexOperator = false;
	}

	public onBackSpaceBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn('Backspace');
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
		this._handleActiveBtn('Escape');
		event.value = '0';
		this.calculatorInvoker.clearAction();
		event.focus();
	}

	public onDecimalBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('.');
		if (event.value === '0') {
			event.value += '.';
			this.calculatorInvoker.isDeleteResultDisplay = true;
		} else if (!event.value.includes('.')) {
			event.value += '.';
			this.calculatorInvoker.isDeleteResultDisplay = true;
		}
		event.focus();
	}

	public onAbsBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn('abs');
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) return;
		event.value = event.value.startsWith('-') ? event.value.replace('-', '') : '-'.concat(event.value);
		event.focus();
	}

	public onKeyDownCalculatorContainer(event: KeyboardEvent) {
		this.inputRef.nativeElement.focus();
		//**handle number pad:
		if (event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) {
			this._handleActiveBtn(event.key);
			if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) this.inputRef.nativeElement.value = '';
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
		} else {
			//**handle operators here:
			event.preventDefault();
			switch (event.key) {
				case 'Escape':
					this.onClearBtn(this.inputRef.nativeElement);
					break;
				case 'Backspace':
					this.onBackSpaceBtn(this.inputRef.nativeElement);
					break;
				case '+':
					this.onClickHandleAddBtn(this.inputRef.nativeElement);
					break;
				case '-':
					this.onClickHandleSubtractBtn(this.inputRef.nativeElement);
					break;
				case '*':
					this.onClickHandleMultiplyBtn(this.inputRef.nativeElement);
					break;
				case '/':
					this.onClickHandleDivideBtn(this.inputRef.nativeElement);
					break;
				case '=':
					this.onClickEndCalculationBtn(this.inputRef.nativeElement);
					break;
				case '.':
					this.onDecimalBtn(this.inputRef.nativeElement);
			}
		}
	}

	onHandleInput(event: HTMLTextAreaElement) {}

	public onHandleClickCalculatorContainer(event: MouseEvent): void {
		if (!(event.target as HTMLElement).classList.contains('histories-expression')) return;
		const selObj = window.getSelection();
		if (selObj && this._regexDigit.test(selObj.toString().trim())) {
			this.inputRef.nativeElement.value = this.thousandsSeparator.transform(selObj.toString().trim());
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
		}
	}

	private _handleActiveBtn(key: string) {
		this.btnRef.forEach(btn => {
			const classList = btn.nativeElement.classList;
			if (classList.contains('active')) {
				classList.remove('active');
			}
			const btnKey = this._btnMap.find(s => s.key === key);
			if (btnKey && classList.contains(btnKey.class)) {
				classList.add('active');
				return;
			}
		});
	}

	public generateSuggest(event: HTMLTextAreaElement) {
		const numberUnformatted = unformattedNumber(event.value.trim());
		const numberSuggest1x = (numberUnformatted * 10).toString();
		const numberSuggest3x = (numberUnformatted * 1000).toString();
		const numberSuggest4x = (numberUnformatted * 10000).toString();
	}

	public onSelectionChange(e: any) {
		console.log(e);
	}
}
