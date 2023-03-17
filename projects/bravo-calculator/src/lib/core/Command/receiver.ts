import { BehaviorSubject } from 'rxjs';
import { EOperatorEVal, EOperatorString } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';

export class CalculatorReceiver {
	private _currentOperatorSubject = new BehaviorSubject<EOperatorString>(EOperatorString.Addition);
	private _nextOperator = new BehaviorSubject<boolean>(false); // set and check switch operator
	private _deleteResultDisplay = new BehaviorSubject<boolean>(false); // prevent deletion result

	private _expressionBuilder: string = ''; // build expression
	private _expressionEvalBuilder: string = ''; // build eval expression
	public result: number = 0;
	private _isStartBuildExpression: boolean = false;
	private _calculationHistories: string[] = []; // cache expression calculation

	public setIsNexOperator(flag: boolean) {
		this._nextOperator.next(flag);
	}

	public setIsDeleteResultDisplay(flag: boolean) {
		this._deleteResultDisplay.next(flag);
	}

	public get IsDeleteResultDisplay() {
		return this._deleteResultDisplay.getValue();
	}

	public get isNextOperator(): boolean {
		return this._nextOperator.getValue();
	}

	public get expressionStringBuilder(): string {
		return this._expressionBuilder;
	}

	get calculationHistories(): string[] {
		return this._calculationHistories;
	}

	public switchNextOperator() {
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

	public setCurrentOperator(operator: EOperatorString) {
		if (this.currentOperator !== operator) this._currentOperatorSubject.next(operator);
		this._isStartBuildExpression && this.isNextOperator && this.switchNextOperator();
	}

	get currentOperator() {
		return this._currentOperatorSubject.getValue();
	}

	//=========================================================================================================================================================================================================================
	//**Handle Command here!
	//**add
	public handleAddCommand(request: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.Equal) this.endBuildExpression();
		this.setCurrentOperator(EOperatorString.Addition);
		this._executeCommand(request.operands);
	}

	//**Subtract */
	public handleSubtractCommand(request: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.Equal) this.endBuildExpression();
		this.setCurrentOperator(EOperatorString.Subtraction);
		this._executeCommand(request.operands);
	}

	//**Multiply */
	public handleMultiplyCommand(request: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.Equal) this.endBuildExpression();
		this.setCurrentOperator(EOperatorString.Multiplication);
		this._executeCommand(request.operands);
	}

	//**Divide */
	public handleDivideCommand(request: ObjRequestCommand): void {
		if (this.currentOperator === EOperatorString.Equal) this.endBuildExpression();
		this.setCurrentOperator(EOperatorString.Division);
		this._executeCommand(request.operands);
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
	private _executeCommand(operands: number[] | number): void {
		if (this.isNextOperator) return;
		this._buildExpressionString(operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
	}

	//**Clean Command */
	public handleClean(): void {
		//reset new state and default values
		this.result = 0;
		this._calculationHistories = [];
		this.beginBuildExpression();
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
		let expressionComplete = '';
		if (!Array.isArray(request.operands)) {
			if (this.isNextOperator) {
				this.setCurrentOperator(EOperatorString.Equal);
				expressionComplete = this._expressionBuilder + `${this._isInt(this.result) ? this.result.toFixed(1) : this.result}`;
			} else {
				this._expressionBuilder += `${this._isInt(request.operands) ? request.operands.toFixed(1) : request.operands}`;
				this._expressionEvalBuilder += `${this._isInt(request.operands) ? request.operands.toFixed(1) : request.operands}`;
				this._executeExpression(this._expressionEvalBuilder);
				expressionComplete = this._expressionBuilder + `${EOperatorString.Equal}${this._isInt(this.result) ? this.result.toFixed(1) : this.result}`;
				this._expressionBuilder += EOperatorString.Equal;
			}
		}
		this.setIsNexOperator(false);
		this.setCurrentOperator(EOperatorString.Equal);
		this._saveCalculationExpressions(expressionComplete);
	}
	//============================================================================================================================================================================================================================================

	//**begin calculate */
	public beginBuildExpression() {
		this._isStartBuildExpression = true;
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
	}

	//**end calculate */
	public endBuildExpression() {
		this._isStartBuildExpression = false;
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
	}

	//**save calculate expression */
	private _saveCalculationExpressions(expression: string) {
		if (this._calculationHistories.length < 5 && expression.length > 0) this._calculationHistories.push(expression);
		else if (this._calculationHistories.length >= 5) {
			this._calculationHistories.shift();
			this._calculationHistories.push(expression);
		}
	}

	//** Build Expression String */
	private _buildExpressionString(operands: number[] | number) {
		if (!this._isStartBuildExpression) this.beginBuildExpression();
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
			equation = operand.toFixed(1) + operatorDisplay;
			equationEval = operand + operatorEval;
		}
		this._expressionBuilder += equation;
		this._expressionEvalBuilder += equationEval;
		this.setIsNexOperator(true);
	}

	private _removeTrailingSymbols(input: string): string {
		const ending = input.slice(-3);
		if (
			ending === EOperatorString.Addition ||
			ending === EOperatorString.Division ||
			ending === EOperatorEVal.Division ||
			ending === EOperatorString.Multiplication ||
			ending === EOperatorEVal.Multiplication ||
			ending === EOperatorString.Subtraction ||
			ending === EOperatorString.Equal
		) {
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

	private _executeExpression(express: string) {
		if (this._validateExpression(express)) {
			this.result = eval(express);
			this.setIsDeleteResultDisplay(false);
		} else {
			alert(`Expression invalid: ${express}`);
			console.log(express);
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
