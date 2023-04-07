import { Injectable } from '@angular/core';
import { convertStrFormatType } from '../../shared/utils';
import { EInputAction, EOperatorEVal, EOperatorString, ObjRequestCommand } from '../data-type';

@Injectable()
export class CalculatorReceiver {
	//**Declaration here */
	public result: string = '0';
	private _currentOperator!: EOperatorString;
	private _currentInputAction!: EInputAction;
	private _isNextOperator!: boolean;
	private _isNextSignal!: boolean;
	private _isDeleteResultDisplay!: boolean;
	private _expressionBuilder!: string; // build expression
	private _previousExpressionBuilder!: string;
	private _previousExpressionEvalBuilder!: string;
	private _expressionEvalBuilder!: string; // build eval expression
	private _isStartBuildExpression!: boolean;
	private _calculationHistories!: string[]; // cache expression calculation

	//**get end setter here:
	//isNextOperator
	public set isNextOperator(flag: boolean) {
		this._isNextOperator = flag;
	}

	public get isNextOperator(): boolean {
		return this._isNextOperator;
	}
	//isNextSignal
	public set isNextSignal(flag: boolean) {
		this._isNextSignal = flag;
	}

	public get isNextSignal() {
		return this._isNextSignal;
	}

	//isDeleteResultDisplay
	public set isDeleteResultDisplay(flag: boolean) {
		this._isDeleteResultDisplay !== flag && (this._isDeleteResultDisplay = flag);
	}

	public get isDeleteResultDisplay() {
		return this._isDeleteResultDisplay;
	}

	//expressionSringBuilder
	public get expressionStringBuilder(): string {
		return this._expressionBuilder;
	}

	public get calculationHistories(): string[] {
		return this._calculationHistories;
	}

	//current Operator
	public get currentOperator() {
		return this._currentOperator;
	}

	public set currentOperator(operator: EOperatorString) {
		this.currentOperator !== operator && (this._currentOperator = operator);
		this._isStartBuildExpression && this.isNextOperator && this._switchNextOperator();
	}

	public set currentInputAction(action: EInputAction) {
		this._currentInputAction = action;
	}
	public get currentInputAction() {
		return this._currentInputAction;
	}

	constructor() {
		this.handleClean(true);
	}
	//=========================================================================================================================================================================================================================
	//**Handle Command here!
	public handleSignalCommand(request: ObjRequestCommand) {
		if (this.currentOperator === EOperatorString.Equal) return; //khi kết thúc phép tính (equal cmd) thì không bắn dữ liệu lên chỉ khi ấn (clear cmd) thì mới bắt đầu bắn lại giữ liệu (behavior trên win)
		if (request.operands && request.operands.length > 0) this._executeCommand(request);
		else this.currentOperator = request.operator;
	}

	//**add
	public handleAddCommand(request: ObjRequestCommand): void {
		this._executeCommand(request);
	}

	//**Subtract */
	public handleSubtractCommand(request: ObjRequestCommand): void {
		this._executeCommand(request);
	}

	//**Multiply */
	public handleMultiplyCommand(request: ObjRequestCommand): void {
		this._executeCommand(request);
	}

	//**Divide */
	public handleDivideCommand(request: ObjRequestCommand): void {
		this._executeCommand(request);
	}

	//**Divide percent */
	public handleDivisionPercentCommand(request: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.DivisionPercent) return;
		let operand = request.operands as string;
		if (operand === '0' && this.result === '0') return;
		let expressionPercent = '';
		//!!Luôn build expression để tính toán.
		if (this.isNextOperator) {
			expressionPercent = this.result + EOperatorEVal.Division + '100' + EOperatorEVal.Multiplication + this.result;
		} else {
			expressionPercent = this.result + EOperatorEVal.Division + '100' + EOperatorEVal.Multiplication + operand;
		}
		let result = this._executeExpression(expressionPercent, false) as string;
		this._executeCommand({ ...request, operands: result });
	}

	//**execute command */
	private _executeCommand({ operands, operator }: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.Equal) this._endBuildExpression(); //nếu currentOperator === equal  kết thúc phép tính nếu ấn vào operator kế tiếp
		if (this.currentOperator === EOperatorString.DivisionPercent) {
			// trường hợp nếu hiện tại là division percent nối tiếp operator kế tiếp vào expression( vì division percent là chuỗi rộng hành vi theo win)
			let operatorDisplay: string = operator;
			let operatorEval: string = operator;
			if (operator === EOperatorString.Multiplication) {
				operatorEval = EOperatorEVal.Multiplication;
			} else if (operator === EOperatorString.Division) {
				operatorEval = EOperatorEVal.Division;
			}
			this._expressionBuilder += operatorDisplay;
			this._expressionEvalBuilder += operatorEval;
		}
		//handle input action is event or signal
		if (this.currentInputAction === EInputAction.Event) {
			this.currentOperator = operator;
			if (this.isNextOperator) return;
			this._buildExpressionString(operands);
			this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
		} else {
			//this.isNextOperator luôn bằng true;
			this._buildExpressionString(operands, !this.isNextSignal);
			this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
			return;
		}
	}

	//**Clean Command */
	public handleClean(isClearAll: boolean = false): void {
		//reset state:
		this.isNextOperator = false;
		this.isNextSignal = false;
		this.isDeleteResultDisplay = false;
		this._isStartBuildExpression = false;
		//reset value
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
		this.currentOperator = EOperatorString.Addition;
		this.currentInputAction = EInputAction.Event;
		this.result = '0';
		if (isClearAll) {
			this._calculationHistories = [];
		}
	}

	//**backspace command
	public handleBackspace(operand: number) {
		let strInput = operand.toString();
		if (strInput.length === 1) {
			return 0;
		}
		strInput = strInput.slice(0, -1);
		return parseInt(strInput);
	}

	//**equal command
	public handleEqualCommand(request: ObjRequestCommand) {
		if (this.currentOperator === EOperatorString.Equal || !this._isStartBuildExpression || (this.expressionStringBuilder === '' && this._expressionEvalBuilder === '')) {
			console.warn('Do not start calculate expression!!!');
			return;
		}
		let completeExpression = '';
		if (!Array.isArray(request.operands)) {
			if (this.isNextOperator) {
				if (this.currentOperator === EOperatorString.DivisionPercent) {
					this.currentOperator = EOperatorString.Equal;
					completeExpression = this._expressionBuilder + `${EOperatorString.Equal}${convertStrFormatType(this.result.toString())}`;
					this._expressionBuilder += this.currentOperator;
					this._expressionEvalBuilder += this.currentOperator;
				} else {
					this.currentOperator = EOperatorString.Equal;
					completeExpression = this._expressionBuilder + `${convertStrFormatType(this.result.toString())}`;
				}
			} else {
				this._expressionBuilder += `${convertStrFormatType(request.operands)}`;
				this._expressionEvalBuilder += `${convertStrFormatType(request.operands)}`;
				this._executeExpression(this._expressionEvalBuilder);
				completeExpression = this._expressionBuilder + `${EOperatorString.Equal}${convertStrFormatType(this.result.toString())}`;
				this._expressionBuilder += EOperatorString.Equal;
				this.currentOperator = EOperatorString.Equal;
			}
		}
		this.isNextOperator = false; //xét lại isNextOperator để build expression mới khi kết thúc expression
		this.isNextSignal = true; // xét isNextSignal = true để khi kết thúc expression
		this.currentInputAction = EInputAction.Event; //xét lại currentInputAction là event để khi click vào operator sẽ thực hiện các phép tính mới
		this._saveCompleteExpressions(completeExpression);
	}
	//============================================================================================================================================================================================================================================

	//**begin calculate */
	private _beginBuildExpression() {
		this._isStartBuildExpression = true;
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
	}

	//**end calculate */
	private _endBuildExpression() {
		this._isStartBuildExpression = false;
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
	}
	//**save calculate expression */
	private _saveCompleteExpressions(expression: string) {
		if (this._calculationHistories.length < 5 && expression.length > 0) this._calculationHistories.push(expression);
		else if (this._calculationHistories.length >= 5) {
			this._calculationHistories.shift();
			this._calculationHistories.push(expression);
		}
	}

	//** Build Expression String */
	private _buildExpressionString(pOperands: string[] | string, isRebuildExpression: boolean = false) {
		if (!this._isStartBuildExpression) this._beginBuildExpression();
		let operatorDisplay: string = this.currentOperator;
		let operatorEval: string = this.currentOperator;
		if (this.currentOperator === EOperatorString.Multiplication) {
			operatorEval = EOperatorEVal.Multiplication;
		} else if (this.currentOperator === EOperatorString.Division) {
			operatorEval = EOperatorEVal.Division;
		}
		let equation;
		let equationEval;
		let nextOperatorEval = this.currentInputAction === EInputAction.Signal ? EOperatorEVal.Addition : operatorEval;
		let nextOperator = this.currentInputAction === EInputAction.Signal ? EOperatorEVal.Addition : operatorDisplay;
		if (this.currentInputAction === EInputAction.Event || (this.currentInputAction === EInputAction.Signal && pOperands.length === 1)) {
			let operand = typeof pOperands === 'string' ? pOperands : pOperands[0];
			equation = convertStrFormatType(operand) + nextOperator;
			equationEval = operand + nextOperatorEval;
		} else {
			let operands = pOperands as string[];
			equation = operands.map(operand => convertStrFormatType(operand)).join(EOperatorString.Addition);
			equation = '('.concat(equation).concat(')');
			equation += nextOperator;
			equationEval = operands.map(val => val).join(EOperatorEVal.Addition);
			equationEval = '('.concat(equationEval).concat(')');
			equationEval += nextOperatorEval;
		}

		if (this.currentInputAction === EInputAction.Event) {
			this._expressionBuilder += equation;
			this._expressionEvalBuilder += equationEval;
		} else {
			if (isRebuildExpression) {
				this._expressionBuilder = this._previousExpressionBuilder + equation;
				this._expressionEvalBuilder = this._previousExpressionEvalBuilder + equationEval;
			} else {
				this._previousExpressionBuilder = this._expressionBuilder; //cache the previous expression
				this._previousExpressionEvalBuilder = this._expressionEvalBuilder;
				this._expressionBuilder += equation;
				this._expressionEvalBuilder += equationEval;
			}
		}
		//sau khi build xong expression bật flag cho phép switch các toán tử và replace trong trường hợp bắn signal
		this.isNextOperator = true;
		this.isNextSignal = false;
	}

	private _removeTrailingSymbols(input: string): string {
		const ending = input.slice(-3);
		if (this._isEndingSymbols(ending)) {
			return input.slice(0, -3);
		}
		return input;
	}

	private _isEndingSymbols(input: string) {
		const ending = input.slice(-3);
		return ending === EOperatorString.Addition || ending === EOperatorString.Division || ending === EOperatorEVal.Division || ending === EOperatorString.Multiplication || ending === EOperatorEVal.Multiplication || ending === EOperatorString.Subtraction || ending === EOperatorString.Equal;
	}

	private _switchNextOperator() {
		if (!this._isEndingSymbols(this._expressionBuilder) && !this._isEndingSymbols(this._expressionEvalBuilder)) return;
		switch (this.currentOperator) {
			case EOperatorString.Multiplication:
				this._expressionEvalBuilder = this._expressionEvalBuilder.slice(0, -3) + EOperatorEVal.Multiplication;
				break;
			case EOperatorString.Division:
				this._expressionEvalBuilder = this._expressionEvalBuilder.slice(0, -3) + EOperatorEVal.Division;
				break;
			default:
				this._expressionEvalBuilder = this._expressionEvalBuilder.slice(0, -3) + this.currentOperator;
				break;
		}
		this._expressionBuilder = this._expressionBuilder.slice(0, -3) + this.currentOperator;
	}

	private _executeExpression(express: string, isSaveResultGlobal: boolean = true): string | void {
		//!! Sử dụng core expression core để tính toán
		if (this._validateExpression(express)) {
			let result = '';
			if (isSaveResultGlobal) this.result = ''.concat(eval(express));
			else result = result.concat(eval(express));
			this.isDeleteResultDisplay = false;
			return result;
		} else {
			alert(`Expression invalid: ${express}`);
			console.error(express);
		}
	}

	private _validateExpression(expression: string): boolean {
		const allowedCharacters = /^[-()\d/*+. ]+$/; // This regular expression will only allow basic math operators, parentheses, and numbers
		if (!expression.match(allowedCharacters)) return false;
		try {
			const result = eval(expression);
			if (result === Infinity || Number.isNaN(result)) {
				throw new Error('Expression invalid!!!');
			}
			return true;
		} catch (e) {
			return false;
		}
	}
}
