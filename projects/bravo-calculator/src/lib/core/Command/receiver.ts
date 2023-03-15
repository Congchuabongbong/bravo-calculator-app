import { BehaviorSubject } from 'rxjs';
import { EOperatorEVal, EOperatorString } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';
//handle logic here

export class CalculatorReceiver {
	private _currentOperatorSubject = new BehaviorSubject<EOperatorString>(EOperatorString.Addition);
	private _nextOperator = new BehaviorSubject<boolean>(false);
	private _expressionBuilder: string = '';
	private _expressionEvalBuilder: string = '';
	public result: number = 0;
	private _isResultDisplayed: boolean = false;
	private _isStartCalculateExpression: boolean = false;

	public setIsNexOperator(flag: boolean) {
		this._nextOperator.next(flag);
	}

	public get isNextOperator() {
		return this._nextOperator.getValue();
	}

	public get expressionStringBuilder() {
		return this._expressionBuilder;
	}

	get isResultDisplayed(): boolean {
		return this._isResultDisplayed;
	}

	public switchNextOperator() {
		if (!this._isStartCalculateExpression && !this.isNextOperator && !this._isEndingSymbols(this._expressionBuilder) && !this._isEndingSymbols(this._expressionEvalBuilder)) return;
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
		this._currentOperatorSubject.next(operator);
		this.switchNextOperator();
	}

	get currentOperator() {
		return this._currentOperatorSubject.getValue();
	}

	//**Handle Command here!

	//**add
	public handleAdd(request: ObjRequestCommand): void {
		this.setCurrentOperator(EOperatorString.Addition);
		this._executeCommand(request.operands);
	}

	//**Subtract */
	public handleSubtract(request: ObjRequestCommand): void {
		this.setCurrentOperator(EOperatorString.Subtraction);
		this._executeCommand(request.operands);
	}

	//**Multiply */
	public handleMultiply(request: ObjRequestCommand): void {
		this.setCurrentOperator(EOperatorString.Multiplication);
		this._executeCommand(request.operands);
	}

	//**Divide */
	public handleDivide(request: ObjRequestCommand): void {
		this.setCurrentOperator(EOperatorString.Division);
		this._executeCommand(request.operands);
	}

	//**Divide percent */
	public handleDividePercent(operands: number): number {
		return operands / 100;
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
		this.result = 0;
		this._isResultDisplayed = false;
		this.beginCalculate();
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
	public handleEndCalculation(): string {
		//TODO: handle last input when click endCalculator
		if (!this._isStartCalculateExpression) {
			console.warn('Do not start calculate expression!!!');
			return '';
		}
		this._expressionBuilder = this._removeTrailingSymbols(this._expressionBuilder);
		let completeHistory = (this._expressionBuilder += ` = ${this.result.toFixed(1)}`);
		this._isResultDisplayed = true;
		this.endCalculate();
		return completeHistory;
	}

	public beginCalculate() {
		this._isStartCalculateExpression = true; //start build expression
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
	}

	//turn off flag
	public endCalculate() {
		this._isStartCalculateExpression = false;
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
		this.setIsNexOperator(false);
	}

	//** Build Expression String */
	private _buildExpressionString(operands: number[] | number) {
		if (!this._isStartCalculateExpression) this.beginCalculate();
		let operatorDisplay: string = this.currentOperator;
		let operatorEval: string = this.currentOperator;
		if (this.currentOperator === EOperatorString.Multiplication) {
			operatorEval = EOperatorEVal.Multiplication;
		} else if (this.currentOperator === EOperatorString.Division) {
			operatorEval = EOperatorEVal.Division;
		}
		let equation;
		let equationEval;
		if (Array.isArray(operands)) {
			equation = operands.map(val => val.toFixed(1)).join(operatorDisplay);
			equation = '('.concat(equation).concat(')');
			equation += operatorDisplay;
			equationEval = operands.map(val => val).join(operatorEval);
			equationEval = '('.concat(equationEval).concat(')');
			equationEval += operatorEval;
		} else {
			equation = operands.toFixed(1) + operatorDisplay;
			equationEval = operands + operatorEval;
		}
		if (this._isResultDisplayed) {
			equation = (this.result.toFixed(1) + operatorDisplay).concat(equation);
			equationEval = (this.result.toString() + operatorEval).concat(equationEval);
			this._isResultDisplayed = false;
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
			ending === EOperatorString.Subtraction
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
			ending === EOperatorString.Subtraction
		);
	}

	private _executeExpression(express: string) {
		if (this._validateExpression(express)) {
			this.result = eval(express);
		} else {
			console.log('Invalid expression!');
		}
	}

	private _validateExpression(expression: string): boolean {
		const allowedCharacters = /^[-()\d/*+. ]+$/; // This regular expression will only allow basic math operators, parentheses, and numbers
		if (!expression.match(allowedCharacters)) {
			// If the expression contains any inappropriate characters, return false
			return false;
		}
		try {
			eval(expression); // Try evaluating the expression using eval()
			return true; // If there was no error and the expression is a valid mathematical expression, return true
		} catch {
			return false; // If an error occurred (e.g. due to injection of non-mathematical code), return false
		}
	}
}
