import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { PopupPosition, Tooltip } from '@grapecity/wijmo';
import { CalculatorInvoker } from './core/Command/invoker.service';
import { ECalculationChannel, EEvenKey, EFormatSymbol, EInputAction, EKeyCmdOption, EOperatorString, EOptionCmd, OptionCmd, OptionsMenu } from './core/data-type';
import { defaultMenuOpts } from './init-app/defaultMenuOpts';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';
import { formatNumber, isIntStr, unformattedNumber } from './shared/utils';

@Component({
	selector: 'lib-bravo-calculator',
	templateUrl: './bravo-calculator.component.html',
	styleUrls: ['./bravo-calculator.component.scss', './bravo-calculator.component.base.scss'],
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
	private _receiverDataChannel!: BroadcastChannel;
	private _senderStateChannel!: BroadcastChannel;
	private _menuCommandOptions!: OptionsMenu[];
	private _tooltipHistories!: Tooltip;
	private _selectedOptionEscCmd!: OptionCmd[];
	private _selectedOptionEnterCmd!: OptionCmd[];
	private _selectedOptionOtherCmd!: OptionCmd[];
	private _isActiveCalculator!: boolean;
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
	constructor(private _el: ElementRef, public calculatorInvoker: CalculatorInvoker, private renderer2: Renderer2, private _cdr: ChangeDetectorRef) {
		this._receiverDataChannel = new BroadcastChannel(ECalculationChannel.DataCommunication);
		this._senderStateChannel = new BroadcastChannel(ECalculationChannel.StateCommunication);
		//lắng nghe chéo
		this._senderStateChannel.addEventListener('message', () => {
			if (this._isActiveCalculator) this._senderStateChannel.postMessage(true);
			else this._senderStateChannel.postMessage(false);
		});
		this._isActiveCalculator = true;
		this._senderStateChannel.postMessage(true);
	}

	ngAfterViewInit(): void {
		//subscribe chanel
		this._receiverDataChannel.addEventListener('message', (event: MessageEvent<string[]>) => {
			if (this._selectOptByKey(this._selectedOptionOtherCmd, EOptionCmd.AutoCalculate) && event.data.length > 0) {
				this.calculatorInvoker.currentInputAction = EInputAction.Signal;
				this.calculatorInvoker.handleSignalAction(EOperatorString.Addition, event.data);
				this._inputRef.nativeElement.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
			}
		});
		this._initTooltip();
	}

	//**Lifecycle here
	ngOnInit(): void {
		this._onCloseCalculator();
	}

	ngOnDestroy(): void {
		this._senderStateChannel.postMessage(false);
		this._cleanEvents();
	}

	private _cleanEvents(): void {
		this._receiverDataChannel.close();
		this._senderStateChannel.close();
		this._tooltipHistories.dispose();
		const elClone = this._el.nativeElement.cloneNode(true);
		document.replaceChild(this._el.nativeElement, elClone);
	}

	private _onCloseCalculator() {
		//bắn signal state và save menu option khi máy tính đóng
		window.addEventListener('unload', e => {
			e.preventDefault();
			this._senderStateChannel.postMessage(false);
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

	//**Handle events for operator
	/** @BtnAdd */
	public onClickHandleAddBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Addition);
		if (this.calculatorInvoker.currentInputAction === EInputAction.Event) {
			this._handleClickOperators(event, EEvenKey.Addition);
			this._resetSuggest();
		} else this.calculatorInvoker.handleSignalAction(EOperatorString.Addition);
		this.calculatorInvoker.isNextSignal = true; //luôn bật isNextSignal = true để khi bắn dữ liệu ko rebuild expression nếu nhấn vào operator bất kì
	}

	/** @BtnSubtract */
	public onClickHandleSubtractBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Subtraction);
		if (this.calculatorInvoker.currentInputAction === EInputAction.Event) {
			this._handleClickOperators(event, EEvenKey.Subtraction);
			this._resetSuggest();
		} else this.calculatorInvoker.handleSignalAction(EOperatorString.Subtraction);
		this.calculatorInvoker.isNextSignal = true;
	}

	/** @BtnMultiply */
	public onClickHandleMultiplyBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Multiplication);
		if (this.calculatorInvoker.currentInputAction === EInputAction.Event) {
			this._handleClickOperators(event, EEvenKey.Multiplication);
			this._resetSuggest();
		} else this.calculatorInvoker.handleSignalAction(EOperatorString.Multiplication);
		this.calculatorInvoker.isNextSignal = true;
	}

	/** @BtnDivide */
	public onClickHandleDivideBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Division);
		if (this.calculatorInvoker.currentInputAction === EInputAction.Event) {
			this._handleClickOperators(event, EEvenKey.Division);
			this._resetSuggest();
		} else this.calculatorInvoker.handleSignalAction(EOperatorString.Division);
		this.calculatorInvoker.isNextSignal = true;
	}

	private _handleClickOperators(event: HTMLTextAreaElement, operator: EEvenKey) {
		let value = event.value;
		value = unformattedNumber(this._changeIntToDecimal(value));
		switch (operator) {
			case EEvenKey.Addition:
				this.calculatorInvoker.addAction(value);
				break;
			case EEvenKey.Subtraction:
				this.calculatorInvoker.subtractAction(value);
				break;
			case EEvenKey.Multiplication:
				this.calculatorInvoker.multiplyAction(value);
				break;
			case EEvenKey.Division:
				this.calculatorInvoker.divideAction(value);
				break;
		}
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
	}

	//======================================================================================
	/** @BtnPercent */
	public onClickHandleDividePercentBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.DivisionPercent);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
		this.calculatorInvoker.isNextOperator = false; //-> Tắt cờ isNextOperator để build ra expression => (tạo operator).
		let value = event.value;
		value = this._changeIntToDecimal(value);
		if (this.calculatorInvoker.result !== '0') {
			this.calculatorInvoker.dividePercentAction(unformattedNumber(value));
		}
		event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
		this._resetSuggest();
	}

	/** @BtnEqual */
	public onClickEqualBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.Equal);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
		let value = event.value;
		value = this._changeIntToDecimal(value);
		this.calculatorInvoker.endCalculationAction(unformattedNumber(value));
		if (!this.calculatorInvoker.isDeleteResultDisplay) {
			event.value = this._formatThousandsSeparated(this.calculatorInvoker.result);
			this._resetSuggest();
		}
	}

	/** @BtnEqual */
	public onClickNumbersPadBtn(event: string): void {
		this._handleActiveBtn(event);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
		if (this._inputRef.nativeElement.value === '0' || this.calculatorInvoker.isDeleteResultDisplay === false) {
			this._inputRef.nativeElement.value = '';
			this._resetFontSizeInput();
		}
		this._inputRef.nativeElement.value = this._formatThousandsSeparated((this._inputRef.nativeElement.value += event));
		this.generateSuggest(this._inputRef.nativeElement.value);
		this._changeFontSizeInput(this._inputRef.nativeElement.value);
		this.calculatorInvoker.isDeleteResultDisplay = true;
		this.calculatorInvoker.isNextOperator = false;
	}

	/** @BtnBackspace */
	public onBackspaceBtn(event: HTMLTextAreaElement): void {
		this._handleActiveBtn(EEvenKey.BackSpace);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
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

	/** @BtnClear */
	public onClearBtn(event: HTMLTextAreaElement, isClearAll: boolean = false): void {
		this._handleActiveBtn(EEvenKey.Esc);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
		event.value = '0';
		this.calculatorInvoker.clearAction(isClearAll);
		this._resetFontSizeInput();
		this._resetSuggest();
		event.focus();
	}

	/** @BtnDecimal */
	public onDecimalBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Decimal);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
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

	/** @BtnAbsolute */
	public onAbsBtn(event: HTMLTextAreaElement) {
		this._handleActiveBtn(EEvenKey.Abs);
		this.calculatorInvoker.currentInputAction = EInputAction.Event;
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
					this.onBackspaceBtn(this._inputRef.nativeElement);
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
					this.onClickEqualBtn(this._inputRef.nativeElement);
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
			this.calculatorInvoker.isNextOperator = false;
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
				this.onClickEqualBtn(this._inputRef.nativeElement);
				this._inputRef.nativeElement.select();
				document.execCommand('copy');
			} else if (this._selectOptByKey(selectedOptionCmd, EOptionCmd.Calculate)) this.onClickEqualBtn(this._inputRef.nativeElement);
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
}
