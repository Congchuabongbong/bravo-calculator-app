import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PopupPosition, Tooltip } from '@grapecity/wijmo';
import { CalculatorInvoker } from './core/command/invoker.service';
import { EEvenKey, EKeyCmdOption, EOptionCmd } from './core/data-type/enum';
import { CalculatorAction, ICalculatorPayload, ICalculatorState, OptionCmd, OptionsMenu } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { defaultMenuOpts } from './init-app/defaultMenuOpts';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';
import { ThousandsSeparatorPipe } from './shared/pipes/thousandsSeparator.format';
import { convertStrFormatType, unformattedNumber } from './shared/utils';
import { formatNumber, isIntStr } from './shared/utils/functions.util';

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
	@ViewChildren('btn') btnRef!: QueryList<ElementRef<HTMLButtonElement>>;
	@ViewChild('containerInputSuggest', { static: false }) containerInputSuggest!: ElementRef<HTMLSpanElement>;
	// @ViewChildren('input-suggest', { emitDistinctChangesOnly: false }) btnSuggest!: QueryList<ElementRef<HTMLLIElement>>;
	@Input() titleTooltipHistories: string = 'Click đúp chuột vào một số bất kỳ để lấy giá trị số đó cho máy tính';
	@Input() initsPostValue!: string[];
	private _receiverBroadcast!: BroadcastChannel;
	public inputVal: string = '0';
	private readonly _regexDigit = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	private _tooltipHistories!: Tooltip;

	private _selectedOptionEscCmd!: OptionCmd[];
	private _selectedOptionEnterCmd!: OptionCmd[];
	private _selectedOptionOtherCmd!: OptionCmd[];

	private _previousPostValue!: string[];

	public suggestValueX1: string = '';
	public suggestValueX3: string = '';
	public suggestValueX4: string = '';

	public isResetDisplaySuggest = false;

	private readonly _btnMap = [
		{ key: '0', class: 'btn--0' },
		{ key: '1', class: 'btn--1' },
		{ key: '2', class: 'btn--2' },
		{ key: '3', class: 'btn--3' },
		{ key: '4', class: 'btn--4' },
		{ key: '5', class: 'btn--5' },
		{ key: '6', class: 'btn--6' },
		{ key: '7', class: 'btn--7' },
		{ key: '8', class: 'btn--8' },
		{ key: '9', class: 'btn--9' },
		{ key: EEvenKey.Esc, class: 'btn--clear' },
		{ key: EEvenKey.BackSpace, class: 'btn--backspace' },
		{ key: EEvenKey.Addition, class: 'btn--add' },
		{ key: EEvenKey.Subtraction, class: 'btn--subtract' },
		{ key: EEvenKey.Multiplication, class: 'btn--multiple' },
		{ key: EEvenKey.Division, class: 'btn--divide' },
		{ key: EEvenKey.Equal, class: 'btn--equal' },
		{ key: EEvenKey.Decimal, class: 'btn--decimal' },
		{ key: EEvenKey.Abs, class: 'btn--abs' },
	];

	@Input('menuOptions') set menuCommandOptions(val: OptionsMenu[]) {
		this._getSelectedOptionInCmd(val);
		this._menuCommandOptions = val;
	}

	get menuCommandOptions() {
		if (!this._menuCommandOptions) {
			let menuStorageStr = localStorage.getItem('CalculationMenuOptions');
			this.menuCommandOptions = menuStorageStr ? JSON.parse(menuStorageStr) : defaultMenuOpts;
		}
		return this._menuCommandOptions;
	}

	private _menuCommandOptions!: OptionsMenu[];

	public menuMultipleSelect!: MenuMultipleSelectComponent;
	//**Constructor here */
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
		const timeout = setTimeout(() => {
			if (this.initsPostValue) {
				if (this._selectOptByKey(this._selectedOptionOtherCmd, EOptionCmd.AutoCalculate)) {
					this.calculatorInvoker.addAction(this.initsPostValue);
					this.inputRef.nativeElement.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result));
				}
				this._previousPostValue = this.initsPostValue;
			}
			clearTimeout(timeout);
		});

		this._receiverBroadcast.addEventListener('message', event => {
			if (this._selectOptByKey(this._selectedOptionOtherCmd, EOptionCmd.AutoCalculate)) {
				let isReCalculate = JSON.stringify(this._previousPostValue) !== JSON.stringify(event.data);
				isReCalculate && (this._previousPostValue = event.data);
				this.calculatorInvoker.addAction(event.data, isReCalculate);
				this.inputRef.nativeElement.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result));
			}
		});

		this._initTooltip();
	}

	//**Lifecycle here
	ngOnInit(): void {
		window.addEventListener('unload', e => {
			e.preventDefault();
			localStorage.setItem('CalculationMenuOptions', JSON.stringify(this.menuCommandOptions));
		});
	}

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
		this._handleActiveBtn(EEvenKey.Addition);
		this.calculatorInvoker.addAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result));
		this._resetSuggest();
	}

	public onClickHandleSubtractBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Subtraction);
		this.calculatorInvoker.subtractAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result));
		this._resetSuggest();
		this._hideSuggestContainer();
	}

	public onClickHandleMultiplyBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Multiplication);
		this.calculatorInvoker.multiplyAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result));
		this._resetSuggest();
	}

	public onClickHandleDivideBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Division);
		this.calculatorInvoker.divideAction(unformattedNumber(event.value));
		event.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result));
		this._resetSuggest();
	}

	public onClickEndCalculationBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Equal);
		this.calculatorInvoker.endCalculationAction(unformattedNumber(event.value));
		!this.calculatorInvoker.isDeleteResultDisplay && (event.value = this.thousandsSeparator.transform(convertStrFormatType(this.calculatorInvoker.result)));
		this._resetSuggest();
	}

	public onClickNumbersPadBtn(event: string): void {
		this._handleActiveBtn(event);
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) {
			this.inputRef.nativeElement.value = '';
			this._resetFontSizeInput();
		}
		this.inputRef.nativeElement.value = this.thousandsSeparator.transform((this.inputRef.nativeElement.value += event));
		!isIntStr(this.inputRef.nativeElement.value) && this.generateSuggest(this.inputRef.nativeElement.value);

		this._decreaseFontSizeInput(this.inputRef.nativeElement.value);
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNexOperator = false;
	}

	public onBackSpaceBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.BackSpace);
		if (!this.calculatorInvoker.isDeleteResultDisplay) return;
		if ((event.value.length === 2 && event.value.includes('-')) || event.value.length === 1) event.value = '0';
		event.selectionEnd = event.value.length - 1;
		//handle backspace
		let strInput = event.value;
		if (strInput.length === 1) {
			console.log(strInput);
			this.generateSuggest(this.inputRef.nativeElement.value);
			return;
		}
		if (strInput.endsWith(' ')) strInput = strInput.trimEnd();
		strInput = strInput.slice(0, -1);
		event.value = strInput.trimEnd();
		this._increaseFontSizeInput(event.value);
		!isIntStr(this.inputRef.nativeElement.value) && this.generateSuggest(this.inputRef.nativeElement.value);
		event.focus();
	}

	public onClearBtn(event: HTMLTextAreaElement, isClearAll: boolean = false): void {
		this._handleActiveBtn(EEvenKey.Esc);
		event.value = '0';
		this.calculatorInvoker.clearAction(isClearAll);
		this._resetFontSizeInput();
		this._resetSuggest();
		event.focus();
	}

	public onDecimalBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Decimal);
		if (event.value === '0') {
			event.value += '.';
			this.calculatorInvoker.isDeleteResultDisplay = true;
		} else if (!event.value.includes('.')) {
			event.value += '.';
			this.calculatorInvoker.isDeleteResultDisplay = true;
		}
		this._resetSuggest();
		event.focus();
	}

	public onAbsBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Abs);
		if (this.inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) return;
		event.value = event.value.startsWith('-') ? event.value.replace('-', '') : '-'.concat(event.value);
		!isIntStr(this.inputRef.nativeElement.value) && this.generateSuggest(event.value);
		event.focus();
	}

	@HostListener('keydown', ['$event'])
	public onKeyDownCalculatorContainer(event: KeyboardEvent) {
		this.inputRef.nativeElement.focus();
		event.preventDefault();
		//**handle number pad:
		if (event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) {
			this.onClickNumbersPadBtn(event.key);
			// this._handleActiveBtn(event.key);
		} else {
			//**handle operators here:

			switch (event.key) {
				case EEvenKey.Esc:
					this._handleCmdEnterOrEsc(EKeyCmdOption.Escape);
					break;
				case EEvenKey.Enter:
					this._handleCmdEnterOrEsc(EKeyCmdOption.Enter);
					break;
				case EEvenKey.BackSpace:
					this.onBackSpaceBtn(this.inputRef.nativeElement);
					break;
				case EEvenKey.Addition:
					this.onClickHandleAddBtn(this.inputRef.nativeElement);
					break;
				case EEvenKey.Subtraction:
					this.onClickHandleSubtractBtn(this.inputRef.nativeElement);
					break;
				case EEvenKey.Multiplication:
					this.onClickHandleMultiplyBtn(this.inputRef.nativeElement);
					break;
				case EEvenKey.Division:
					this.onClickHandleDivideBtn(this.inputRef.nativeElement);
					break;
				case EEvenKey.Equal:
					this.onClickEndCalculationBtn(this.inputRef.nativeElement);
					break;
				case EEvenKey.Decimal:
					this.onDecimalBtn(this.inputRef.nativeElement);
			}
		}
	}

	private _handleCmdEnterOrEsc(keyCmd: EKeyCmdOption) {
		let selectedOptionCmd: OptionCmd[] = [];
		switch (keyCmd) {
			case EKeyCmdOption.Enter:
				selectedOptionCmd = this._selectedOptionEnterCmd;
				break;
			case EKeyCmdOption.Escape:
				selectedOptionCmd = this._selectedOptionEnterCmd;
				break;
		}
		//handle escape
		if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Nothing)) return;
		else {
			//Group1
			if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Clear)) this.onClearBtn(this.inputRef.nativeElement);
			else if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.ClearAll)) this.onClearBtn(this.inputRef.nativeElement, true);
			//Group3
			if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.CalculateAndPaste)) {
				this.onClickEndCalculationBtn(this.inputRef.nativeElement);
				this.inputRef.nativeElement.select();
				document.execCommand('copy');
			} else if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Calculate)) this.onClickEndCalculationBtn(this.inputRef.nativeElement);
		}
	}

	private _decreaseFontSizeInput(numberStr: string) {
		let valueUnFormatted = unformattedNumber(numberStr);
		if (valueUnFormatted.length > 19 && valueUnFormatted.length < 29) {
			this.inputRef.nativeElement.style.fontSize = '13px';
			this.inputRef.nativeElement.style.fontWeight = '900';
		} else if (valueUnFormatted.length > 29) {
			this.inputRef.nativeElement.style.fontSize = '12px';
			this.inputRef.nativeElement.value = valueUnFormatted;
		}
	}

	private _increaseFontSizeInput(numberStr: string) {
		let valueUnFormatted = unformattedNumber(numberStr);
		if (valueUnFormatted.length <= 19) {
			this.inputRef.nativeElement.style.fontSize = '24px';
			this.inputRef.nativeElement.style.fontWeight = '500';
			this.inputRef.nativeElement.value = this.thousandsSeparator.transform(this.inputRef.nativeElement.value);
		} else if (valueUnFormatted.length > 19 && valueUnFormatted.length <= 29) {
			this.inputRef.nativeElement.style.fontSize = '13px';
			this.inputRef.nativeElement.value = this.thousandsSeparator.transform(this.inputRef.nativeElement.value);
		}
	}

	private _resetFontSizeInput() {
		this.inputRef.nativeElement.style.fontSize = '24px';
		this.inputRef.nativeElement.style.fontWeight = '500';
	}

	@HostListener('dblclick', ['$event'])
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

	public generateSuggest(numberString: string) {
		const numberUnformatted = unformattedNumber(numberString.trim());
		if (numberString === '0') {
			this._resetSuggest();
			return;
		}
		this.isResetDisplaySuggest = true;
		this.suggestValueX1 = formatNumber(numberUnformatted.concat('00'), ',');
		this.suggestValueX3 = formatNumber(numberUnformatted.concat('000'), ',');
		this.suggestValueX4 = formatNumber(numberUnformatted.concat('0000'), ',');
		setTimeout(() => {
			this._hideSuggestContainer();
		});
	}

	private _resetSuggest() {
		this.isResetDisplaySuggest = false;
		this.suggestValueX1 = '';
		this.suggestValueX3 = '';
		this.suggestValueX4 = '';
	}
	private _hideSuggestContainer() {
		let totalChildrenWidth = 0;
		this.containerInputSuggest.nativeElement.childNodes.forEach(sg => {
			totalChildrenWidth += (sg as HTMLLIElement).offsetWidth + +getComputedStyle(sg as HTMLLIElement).marginLeft.replace('px', '');
		});

		if (this.containerInputSuggest.nativeElement.clientWidth < totalChildrenWidth) this.containerInputSuggest.nativeElement.style.visibility = 'hidden';
		else this.containerInputSuggest.nativeElement.style.visibility = 'visible';
	}
	public onSelectionChange(menuOpts: OptionsMenu[]) {
		menuOpts.forEach(cmd => {
			switch (cmd.keyCmd) {
				case EKeyCmdOption.Enter:
					this._selectedOptionEnterCmd = cmd.optionsCmd.filter(opt => opt.value === true);
					break;
				case EKeyCmdOption.Escape:
					this._selectedOptionEscCmd = cmd.optionsCmd.filter(opt => opt.value === true);
					break;
				case EKeyCmdOption.Other:
					this._selectedOptionOtherCmd = cmd.optionsCmd.filter(opt => opt.value === true);
					break;
			}
		});
	}

	private _selectOptByKey(optsCmd: OptionCmd[], optCmdKey: EOptionCmd): boolean {
		if (optsCmd.length > 0) {
			let isOptSelected = optsCmd.some(opt => opt.optCmdKey === optCmdKey);
			return isOptSelected;
		}
		return false;
	}

	private _getSelectedOptionInCmd(menuOpts: OptionsMenu[]) {
		menuOpts.forEach(cmd => {
			switch (cmd.keyCmd) {
				case EKeyCmdOption.Enter:
					this._selectedOptionEnterCmd = cmd.optionsCmd.filter(opt => opt.value === true);
					break;
				case EKeyCmdOption.Escape:
					this._selectedOptionEscCmd = cmd.optionsCmd.filter(opt => opt.value === true);
					break;
				case EKeyCmdOption.Other:
					this._selectedOptionOtherCmd = cmd.optionsCmd.filter(opt => opt.value === true);
					break;
			}
		});
	}
}
