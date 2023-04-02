import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { PopupPosition, Tooltip } from '@grapecity/wijmo';
import { CalculatorInvoker } from './core/command/invoker.service';
import { EEvenKey, EFormatSymbol, EKeyCmdOption, EOptionCmd } from './core/data-type/enum';
import { CalculatorAction, ICalculatorPayload, ICalculatorState, OptionCmd, OptionsMenu } from './core/data-type/type';
import { CalculatorReducer } from './core/redux/calculatorReduce';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { defaultMenuOpts } from './init-app/defaultMenuOpts';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';
import { formatNumber, isIntStr, unformattedNumber } from './shared/utils';

@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss'],
	styles: [],
})
export class BravoCalculatorComponent implements OnInit, OnDestroy, AfterViewInit {
	//**Declaration here */
	@ViewChild('input', { static: true }) private _inputRef!: ElementRef<HTMLTextAreaElement>;
	@ViewChild('calculatorHistories', { static: true }) private _calculatorHistoriesRef!: ElementRef<HTMLDivElement>;
	@ViewChildren('btn') private _btnRef!: QueryList<ElementRef<HTMLButtonElement>>;
	@ViewChild('containerInputSuggest', { static: false }) private _containerInputSuggest!: ElementRef<HTMLUListElement>;
	//*public
	public inputVal: string = '0';
	public suggestValueX1: string = '';
	public suggestValueX3: string = '';
	public suggestValueX4: string = '';
	public menuMultipleSelect!: MenuMultipleSelectComponent;
	public isResetDisplaySuggest = false;
	//*private
	private readonly _regexDigit = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
	private _receiverBroadcast!: BroadcastChannel;
	private _menuCommandOptions!: OptionsMenu[];
	private _tooltipHistories!: Tooltip;
	private _selectedOptionEscCmd!: OptionCmd[];
	private _selectedOptionEnterCmd!: OptionCmd[];
	private _selectedOptionOtherCmd!: OptionCmd[];
	private _previousPostValue!: string[];
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
		{ key: EEvenKey.DivisionPercent, class: 'btn--percent' },
	];
	//*Input Decorator
	@Input() titleTooltipHistories: string = 'Click đúp chuột vào một số bất kỳ để lấy giá trị số đó cho máy tính';
	@Input() initsPostValue!: string[];
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

	//**Constructor here */
	constructor(public calculationStore: Store<ICalculatorState, ICalculatorPayload>, private _calculationReducers: ReducerService<ICalculatorState, CalculatorAction>, public calculatorInvoker: CalculatorInvoker, private renderer2: Renderer2, private _cdr: ChangeDetectorRef) {
		this._calculationReducers.register(new CalculatorReducer());
		this._receiverBroadcast = new BroadcastChannel('BravoCalculatorApp');
	}

	ngAfterViewInit(): void {
		//set first post calculator
		const timeout = setTimeout(() => {
			if (this.initsPostValue) {
				if (this._selectOptByKey(this._selectedOptionOtherCmd, EOptionCmd.AutoCalculate)) {
					this.calculatorInvoker.addAction(this.initsPostValue);
					this._inputRef.nativeElement.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
				}
				this._previousPostValue = this.initsPostValue;
			}
			clearTimeout(timeout);
		});

		//subscribe chanel
		this._receiverBroadcast.addEventListener('message', event => {
			if (this._selectOptByKey(this._selectedOptionOtherCmd, EOptionCmd.AutoCalculate)) {
				let isReCalculate = JSON.stringify(this._previousPostValue) !== JSON.stringify(event.data);
				isReCalculate && (this._previousPostValue = event.data);
				this.calculatorInvoker.addAction(event.data, isReCalculate);
				this._inputRef.nativeElement.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
			}
		});

		this._initTooltip();
	}

	//**Lifecycle here
	ngOnInit(): void {
		this._saveLocalStorageCurrentMenuOptions();
		// setInterval(() => {
		// 	this._receiverBroadcast.postMessage(this.testRandomRangeArray(4, 10, 100));
		// }, 1000);
		// setInterval(() => {
		// 	this.calculatorInvoker.isNexOperator = false;
		// }, 2000);
		// setInterval(() => {
		// 	this.onClickEndCalculationBtn(this._inputRef.nativeElement);
		// }, 8000);
	}

	ngOnDestroy(): void {
		this._receiverBroadcast.close();
		this._tooltipHistories.dispose();
	}

	private _saveLocalStorageCurrentMenuOptions() {
		window.addEventListener('unload', e => {
			e.preventDefault();
			localStorage.setItem('CalculationMenuOptions', JSON.stringify(this.menuCommandOptions));
		});
	}

	private _initTooltip(): void {
		this._tooltipHistories = new Tooltip();
		this._tooltipHistories.setTooltip(this._calculatorHistoriesRef.nativeElement, this.titleTooltipHistories, PopupPosition.BelowRight);
		this._tooltipHistories.cssClass = 'tooltip-histories';
		this._tooltipHistories.showDelay = 510;
		this._tooltipHistories.isAnimated = true;
		this._tooltipHistories.gap = 0;
	}

	//**Handle events
	public onClickHandleAddBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Addition);
		let value = event.value;
		value = this._changeIntToDecimal(value);
		this.calculatorInvoker.addAction(unformattedNumber(value));
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
		this._resetSuggest();
	}

	public onClickHandleSubtractBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Subtraction);
		let value = event.value;
		value = this._changeIntToDecimal(value);
		this.calculatorInvoker.subtractAction(unformattedNumber(value));
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
		this._resetSuggest();
	}

	public onClickHandleMultiplyBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Multiplication);
		let value = event.value;
		value = this._changeIntToDecimal(value);
		this.calculatorInvoker.multiplyAction(unformattedNumber(value));
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
		this._resetSuggest();
	}

	public onClickHandleDivideBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Division);
		let value = event.value;

		value = this._changeIntToDecimal(value);
		this.calculatorInvoker.divideAction(unformattedNumber(value));
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
		this._resetSuggest();
	}

	public onClickHandleDividePercentBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.DivisionPercent);
		let value = event.value;
		value = this._changeIntToDecimal(value);
		if (this.calculatorInvoker.result !== '0') {
			this.calculatorInvoker.dividePercentAction(unformattedNumber(value));
		}
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
		this._resetSuggest();
	}

	public onClickEndCalculationBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Equal);
		let value = event.value;
		value = this._changeIntToDecimal(value);
		this.calculatorInvoker.endCalculationAction(unformattedNumber(value));
		if (!this.calculatorInvoker.isDeleteResultDisplay) {
			event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
			this._resetSuggest();
		}
	}

	public onClickNumbersPadBtn(event: string): void {
		this._handleActiveBtn(event);
		if (this._inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) {
			this._inputRef.nativeElement.value = '';
			this._resetFontSizeInput();
		}
		this._inputRef.nativeElement.value = this._formatThousandsSeparated((this._inputRef.nativeElement.value += event));
		this.generateSuggest(this._inputRef.nativeElement.value);
		this._changeFontSizeInput(this._inputRef.nativeElement.value);
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
			this.generateSuggest('0');
			return;
		}
		if (strInput.endsWith(' ')) strInput = strInput.trimEnd();
		strInput = strInput.slice(0, -1);
		this.generateSuggest(strInput.trimEnd());
		event.value = strInput.trimEnd();
		this._changeFontSizeInput(event.value);
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
		if (!event.value.includes('.')) {
			if (event.value === '0') {
				event.value += '.';
				this.calculatorInvoker.isDeleteResultDisplay = true;
			} else {
				if (!this.calculatorInvoker.isDeleteResultDisplay) {
					event.value = '0.';
					this.calculatorInvoker.isDeleteResultDisplay = true;
				} else {
					event.value += '.';
				}
			}
			this._resetSuggest();
		}
		event.focus();
	}

	public onAbsBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Abs);
		if (this._inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) return;
		event.value = event.value.startsWith('-') ? event.value.replace('-', '') : '-'.concat(event.value);
		this.generateSuggest(event.value);
		event.focus();
	}

	@HostListener('keydown', ['$event'])
	public onKeyDownCalculatorContainer(event: KeyboardEvent) {
		this._inputRef.nativeElement.focus();
		event.preventDefault();
		//**handle number pad:
		if (event.keyCode >= 48 && event.keyCode <= 57 && !event.shiftKey) {
			this.onClickNumbersPadBtn(event.key);
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
					this.onBackSpaceBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.Addition:
					this.onClickHandleAddBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.Subtraction:
					this.onClickHandleSubtractBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.Multiplication:
					this.onClickHandleMultiplyBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.Division:
					this.onClickHandleDivideBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.Equal:
					this.onClickEndCalculationBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.Decimal:
					this.onDecimalBtn(this._inputRef.nativeElement);
					break;
				case EEvenKey.DivisionPercent:
					this.onClickHandleDividePercentBtn(this._inputRef.nativeElement);
					break;
			}
		}
	}

	@HostListener('dblclick', ['$event'])
	public onHandleClickCalculatorContainer(event: MouseEvent): void {
		if (!(event.target as HTMLElement).classList.contains('histories-expression')) return;
		const selObj = window.getSelection();
		if (selObj && this._regexDigit.test(selObj.toString().trim())) {
			this._inputRef.nativeElement.value = this._formatThousandsSeparated(selObj.toString().trim());
			this.calculatorInvoker.isDeleteResultDisplay = true;
			this.calculatorInvoker.isNexOperator = false;
			this.generateSuggest(this._inputRef.nativeElement.value);
			this._changeFontSizeInput(this._inputRef.nativeElement.value);
		}
	}

	public onClickSuggest(valueSuggest: string, inputEvent: HTMLTextAreaElement) {
		inputEvent.value = formatNumber(valueSuggest, EFormatSymbol.Space, true, EFormatSymbol.Comma);
		this._resetSuggest();
	}

	private _handleCmdEnterOrEsc(keyCmd: EKeyCmdOption) {
		let selectedOptionCmd: OptionCmd[] = [];
		switch (keyCmd) {
			case EKeyCmdOption.Enter:
				selectedOptionCmd = this._selectedOptionEnterCmd;
				break;
			case EKeyCmdOption.Escape:
				selectedOptionCmd = this._selectedOptionEscCmd;
				break;
		}
		if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Nothing)) return;
		else {
			//Group1
			if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Clear)) this.onClearBtn(this._inputRef.nativeElement);
			else if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.ClearAll)) this.onClearBtn(this._inputRef.nativeElement, true);
			//Group3
			if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.CalculateAndPaste)) {
				this.onClickEndCalculationBtn(this._inputRef.nativeElement);
				this._inputRef.nativeElement.select();
				document.execCommand('copy');
			} else if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Calculate)) this.onClickEndCalculationBtn(this._inputRef.nativeElement);
		}
	}

	private _changeFontSizeInput(numberStr: string) {
		let valueUnFormatted = unformattedNumber(numberStr);
		if (valueUnFormatted.length <= 19) {
			if (this._inputRef.nativeElement.style.fontSize !== '24px') {
				this._resetFontSizeInput();
				return;
			}
			this._inputRef.nativeElement.value = this._formatThousandsSeparated(this._inputRef.nativeElement.value);
		} else if (valueUnFormatted.length > 19 && valueUnFormatted.length < 29) {
			this._inputRef.nativeElement.style.fontSize = '13px';
			this._inputRef.nativeElement.style.fontWeight = '900';
			this._inputRef.nativeElement.value = this._formatThousandsSeparated(this._inputRef.nativeElement.value);
		} else if (valueUnFormatted.length > 29) {
			this._inputRef.nativeElement.style.fontSize = '12px';
			this._inputRef.nativeElement.style.fontWeight = '900';
			this._inputRef.nativeElement.value = unformattedNumber(this._inputRef.nativeElement.value);
		}
	}

	private _resetFontSizeInput() {
		this._inputRef.nativeElement.style.fontSize = '24px';
		this._inputRef.nativeElement.style.fontWeight = '500';
	}

	private _handleActiveBtn(key: string) {
		this._btnRef.forEach(btn => {
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
		if (numberString === '0') {
			this._resetSuggest();
			return;
		} else if (isIntStr(numberString)) {
			this.isResetDisplaySuggest = false;
			return;
		}

		const numberUnformatted = unformattedNumber(numberString.trim());
		this.isResetDisplaySuggest = true;
		this.suggestValueX1 = formatNumber(numberUnformatted.concat('00'), EFormatSymbol.Comma);
		this.suggestValueX3 = formatNumber(numberUnformatted.concat('000'), EFormatSymbol.Comma);
		this.suggestValueX4 = formatNumber(numberUnformatted.concat('0000'), EFormatSymbol.Comma);
		if (this.isResetDisplaySuggest) {
			this._cdr.detectChanges(); //update view before calculate size suggestions
			this._hideSuggestContainer();
		}
	}

	private _hideSuggestContainer() {
		if (!this._containerInputSuggest) return;
		let totalChildrenWidth = 0;
		this._containerInputSuggest.nativeElement.childNodes.forEach(sg => {
			totalChildrenWidth += (sg as HTMLLIElement).offsetWidth + +getComputedStyle(sg as HTMLLIElement).marginLeft.replace('px', '');
		});
		if (this._containerInputSuggest.nativeElement.clientWidth < totalChildrenWidth) {
			this._containerInputSuggest.nativeElement.style.visibility = 'hidden';
			this.isResetDisplaySuggest = false;
		} else {
			this._containerInputSuggest.nativeElement.style.visibility = 'visible';
			this.isResetDisplaySuggest = true;
		}
	}

	private _resetSuggest() {
		this.isResetDisplaySuggest = false;
		this.suggestValueX1 = '';
		this.suggestValueX3 = '';
		this.suggestValueX4 = '';
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

	private _formatThousandsSeparated(valStr: string) {
		if (valStr.length <= 0) return valStr;
		else if (unformattedNumber(valStr).length > 29) return unformattedNumber(valStr);
		let decimalPart = '';
		if (valStr.includes('.')) {
			const parts = valStr.split('.');
			valStr = parts[0];
			decimalPart = parts[1];
			return `${formatNumber(valStr.replace(/ /g, ''))}.${decimalPart}`;
		}
		return formatNumber(valStr.replace(/ /g, ''));
	}

	private _changeIntToDecimal(numberStr: string): string {
		if (/^\d+\.$/.test(numberStr)) {
			return numberStr + '0';
		}
		return numberStr;
	}
	private testRandomRangeArray(length: number, min: number, max: number) {
		return Array.from({ length }, () => (Math.floor(Math.random() * (max - min + 1)) + min).toString());
	}
}
