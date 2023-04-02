import { Injectable } from '@angular/core';
import { convertStrFormatType } from '../../shared/utils';

import { EOperatorEVal, EOperatorString } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';

@Injectable()
export class CalculatorReceiver {
	//**Declaration here */
	public result: string = '0';
	private _currentOperator!: EOperatorString;
	private _isNextOperator!: boolean;
	private _isDeleteResultDisplay!: boolean;
	private _expressionBuilder!: string; // build expression
	private _expressionEvalBuilder!: string; // build eval expression
	private _isStartBuildExpression!: boolean;
	private _calculationHistories!: string[]; // cache expression calculation

	//**get end setter here:
	public set isNextOperator(flag: boolean) {
		this._isNextOperator = flag;
	}

	public get isNextOperator(): boolean {
		return this._isNextOperator;
	}

	public set isDeleteResultDisplay(flag: boolean) {
		this._isDeleteResultDisplay !== flag && (this._isDeleteResultDisplay = flag);
	}

	public get isDeleteResultDisplay() {
		return this._isDeleteResultDisplay;
	}

	public get expressionStringBuilder(): string {
		return this._expressionBuilder;
	}

	public get calculationHistories(): string[] {
		return this._calculationHistories;
	}

	public get currentOperator() {
		return this._currentOperator;
	}

	public set currentOperator(operator: EOperatorString) {
		this.currentOperator !== operator && (this._currentOperator = operator);
		this._isStartBuildExpression && this.isNextOperator && this._switchNextOperator();
	}

	constructor() {
		this.handleClean(true);
	}
	//=========================================================================================================================================================================================================================
	//**Handle Command here!
	//**add
	public handleAddCommand(request: ObjRequestCommand): void {
		this._executeCommand(request, EOperatorString.Addition);
	}

	//**Subtract */
	public handleSubtractCommand(request: ObjRequestCommand): void {
		this._executeCommand(request, EOperatorString.Subtraction);
	}

	//**Multiply */
	public handleMultiplyCommand(request: ObjRequestCommand): void {
		this._executeCommand(request, EOperatorString.Multiplication);
	}

	//**Divide */
	public handleDivideCommand(request: ObjRequestCommand): void {
		this._executeCommand(request, EOperatorString.Division);
	}

	//**Divide percent */
	public handleDividePercentCommand(request: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.DividePercent) return;
		let operand = request.operands as string;
		if (operand === '0' && this.result === '0') return;
		let expressionPercent = '';
		if (this.isNextOperator) {
			expressionPercent = this.result + EOperatorEVal.Division + '100' + EOperatorEVal.Multiplication + this.result;
		} else {
			expressionPercent = this.result + EOperatorEVal.Division + '100' + EOperatorEVal.Multiplication + operand;
		}
		this.isDeleteResultDisplay = false;
		this.isNextOperator = false;
		let result = this._executeExpression(expressionPercent, false) as string;
		this._executeCommand({ ...request, operands: result }, EOperatorString.DividePercent);
	}

	//**convert to decimal */
	public convertToDecimal(number: number): number {
		throw new Error('');
	}

	//**Absolute Command
	//**Switch absolute
	public switchAbsoluteValue(number: number): number {
		return Math.abs(number);
	}

	//**execute command */
	private _executeCommand({ isRebuildExpression, operands }: ObjRequestCommand, operatorString: EOperatorString): void {
		if (this.currentOperator === EOperatorString.Equal) this._endBuildExpression();

		if (this.currentOperator === EOperatorString.DividePercent) {
			let operatorDisplay: string = operatorString;
			let operatorEval: string = operatorString;
			if (operatorString === EOperatorString.Multiplication) {
				operatorEval = EOperatorEVal.Multiplication;
			} else if (operatorString === EOperatorString.Division) {
				operatorEval = EOperatorEVal.Division;
			}
			this._expressionBuilder += operatorDisplay;
			this._expressionEvalBuilder += operatorEval;
		}
		this.currentOperator = operatorString;
		if (this.isNextOperator) {
			if (!isRebuildExpression) return;
			this._buildExpressionString(operands, isRebuildExpression);
			this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));

			return;
		}

		this._buildExpressionString(operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
	}

	//**Clean Command */
	public handleClean(isClearAll: boolean = false): void {
		//reset state:
		this.isNextOperator = false;
		this._isDeleteResultDisplay = false;
		this._isStartBuildExpression = false;
		//reset value
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
		this._currentOperator = EOperatorString.Addition;
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
		if (this.currentOperator === EOperatorString.Equal || !this._isStartBuildExpression || (this.expressionStringBuilder.length <= 0 && this._expressionEvalBuilder.length <= 0)) {
			console.warn('Do not start calculate expression!!!');
			return;
		}
		let completeExpression = '';
		if (!Array.isArray(request.operands)) {
			if (this.isNextOperator) {
				if (this.currentOperator === EOperatorString.DividePercent) {
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
		this.isNextOperator = false;
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

	private _previousExpressionBuilder = '';
	private _previousExpressionEvalBuilder = '';
	//**save calculate expression */
	private _saveCompleteExpressions(expression: string) {
		if (this._calculationHistories.length < 5 && expression.length > 0) this._calculationHistories.push(expression);
		else if (this._calculationHistories.length >= 5) {
			this._calculationHistories.shift();
			this._calculationHistories.push(expression);
		}
	}

	//** Build Expression String */
	private _buildExpressionString(operands: string[] | string, isRebuildExpression: boolean = false) {
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
		if (Array.isArray(operands) && operands.length >= 2) {
			equation = operands.map(operand => convertStrFormatType(operand)).join(operatorDisplay);
			equation = '('.concat(equation).concat(')');
			equation += operatorDisplay;
			equationEval = operands.map(val => val).join(operatorEval);
			equationEval = '('.concat(equationEval).concat(')');
			equationEval += operatorEval;
		} else {
			let operand = Array.isArray(operands) ? operands[0] : operands;
			equation = convertStrFormatType(operand) + operatorDisplay;
			equationEval = operand + operatorEval;
		}

		if (isRebuildExpression) {
			this._expressionBuilder = this._expressionBuilder.replace(this._previousExpressionBuilder, '');
			this._expressionEvalBuilder = this._expressionEvalBuilder.replace(this._previousExpressionEvalBuilder, '');
		}
		this._previousExpressionBuilder = equation;
		this._previousExpressionEvalBuilder = equationEval;
		this._expressionBuilder += equation;
		this._expressionEvalBuilder += equationEval;
		this.isNextOperator = true;
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
