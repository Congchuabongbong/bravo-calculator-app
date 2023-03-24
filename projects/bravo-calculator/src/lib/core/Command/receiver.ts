import { EOperatorEVal, EOperatorString } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';
import { Injectable } from '@angular/core';

@Injectable()
export class CalculatorReceiver {
	//**Declaration here */
	public result: number = 0;
	private _currentOperator!: EOperatorString;
	private _isNextOperator!: boolean;
	private _isDeleteResultDisplay!: boolean;
	private _expressionBuilder!: string; // build expression
	private _expressionEvalBuilder!: string; // build eval expression
	private _isStartBuildExpression!: boolean;
	private _calculationHistories!: string[]; // cache expression calculation

	//**get end setter here:
	public set isNexOperator(flag: boolean) {
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
		this._executeCommand(request.operands, EOperatorString.Addition);
	}

	//**Subtract */
	public handleSubtractCommand(request: ObjRequestCommand): void {
		this._executeCommand(request.operands, EOperatorString.Subtraction);
	}

	//**Multiply */
	public handleMultiplyCommand(request: ObjRequestCommand): void {
		this._executeCommand(request.operands, EOperatorString.Multiplication);
	}

	//**Divide */
	public handleDivideCommand(request: ObjRequestCommand): void {
		this._executeCommand(request.operands, EOperatorString.Division);
	}

	//**Divide percent */
	public handleDividePercentCommand(operands: number): number {
		throw new Error('');
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
	private _executeCommand(operands: number[] | number, operatorString: EOperatorString): void {
		if (this.currentOperator === EOperatorString.Equal) this._endBuildExpression();
		this.currentOperator = operatorString;
		if (this.isNextOperator) return;
		if (!this._isStartBuildExpression) this._beginBuildExpression();
		this._buildExpressionString(operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
		this.isNexOperator = true;
	}

	//**Clean Command */
	public handleClean(isReset: boolean = false): void {
		//reset state:
		this._isNextOperator = false;
		this._isDeleteResultDisplay = false;
		this._isStartBuildExpression = false;
		//reset value
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
		this._currentOperator = EOperatorString.Addition;
		this._calculationHistories = [];
		if (isReset) {
			this.result = 0;
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
				this.currentOperator = EOperatorString.Equal;
				completeExpression = this._expressionBuilder + `${this._isInt(this.result) ? this.result.toFixed(1) : this.result}`;
			} else {
				//!!check
				this._expressionBuilder += `${this._isInt(request.operands) ? request.operands.toFixed(1) : request.operands}`;
				this._expressionEvalBuilder += `${this._isInt(request.operands) ? request.operands.toFixed(1) : request.operands}`;
				this._executeExpression(this._expressionEvalBuilder);
				completeExpression = this._expressionBuilder + `${EOperatorString.Equal}${this._isInt(this.result) ? this.result.toFixed(1) : this.result}`;
				this._expressionBuilder += EOperatorString.Equal;
				this.currentOperator = EOperatorString.Equal;
			}
		}
		this.isNexOperator = false;
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
	private _buildExpressionString(operands: number[] | number) {
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
			equation = operands.map(val => val.toFixed(1)).join(operatorDisplay);
			equation = '('.concat(equation).concat(')');
			equation += operatorDisplay;
			equationEval = operands.map(val => val).join(operatorEval);
			equationEval = '('.concat(equationEval).concat(')');
			equationEval += operatorEval;
		} else {
			let operand = Array.isArray(operands) ? operands[0] : operands;
			equation = (this._isInt(operand) ? operand.toFixed(1) : operand) + operatorDisplay;
			equationEval = operand + operatorEval;
		}
		this._expressionBuilder += equation;
		this._expressionEvalBuilder += equationEval;
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
		return (
			ending === EOperatorString.Addition ||
			ending === EOperatorString.Division ||
			ending === EOperatorEVal.Division ||
			ending === EOperatorString.Multiplication ||
			ending === EOperatorEVal.Multiplication ||
			ending === EOperatorString.Subtraction ||
			ending === EOperatorString.Equal
		);
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

	private _executeExpression(express: string) {
		if (this._validateExpression(express)) {
			this.result = eval(express);

			this.isDeleteResultDisplay = false;
		} else {
			alert(`Expression invalid: ${express}`);
			console.error(express);
		}
	}

	private _validateExpression(expression: string): boolean {
		const allowedCharacters = /^[-()\d/*+. ]+$/; // This regular expression will only allow basic math operators, parentheses, and numbers
		if (!expression.match(allowedCharacters)) return false;
		if (expression.includes('/ 0')) return false;
		try {
			eval(expression); // Try evaluating the expression using eval()
			return true; // If there was no error and the expression is a valid mathematical expression, return true
		} catch (error: any) {
			console.error('Expression invalid: ', expression);
			alert(`Expression invalid: ${expression}`);
			throw new Error(error);
		}
	}

	private _isInt(val: number) {
		return Number(val) === val && val % 1 === 0;
	}

	private isFloat(va: number) {
		return Number(va) === va && va % 1 !== 0;
	}
}
