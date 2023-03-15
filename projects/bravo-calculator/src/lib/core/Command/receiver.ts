import { BehaviorSubject } from 'rxjs';
import { EOperatorEVal, EOperatorString } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';
//handle logic here

export class CalculatorReceiver {
	public result: number = 0;
	private _isResultDisplayed: boolean = false;
	public isClear: boolean = false;
	public isReset: boolean = false;

	_expressionBuilder: string = '';
	private _expressionEvalBuilder: string = '';
	private currentOperatorSubject = new BehaviorSubject<EOperatorString>(EOperatorString.Addition);

	public get expressionStringBuilder() {
		return this._expressionBuilder;
	}

	public switchOperator() {
		if (!this._isEndingSymbols(this._expressionBuilder) && !this._isEndingSymbols(this._expressionEvalBuilder)) return;
		this._expressionBuilder = this._expressionBuilder.slice(0, -3) + this.currentOperator;
		if (this.currentOperator === EOperatorString.Multiplication) {
			this._expressionEvalBuilder = this._expressionEvalBuilder.slice(0, -3) + EOperatorEVal.Multiplication;
		} else if (this.currentOperator === EOperatorString.Division) {
			this._expressionEvalBuilder = this._expressionEvalBuilder.slice(0, -3) + EOperatorEVal.Division;
		}
	}

	public setCurrentOperator(operator: EOperatorString) {
		this.currentOperatorSubject.next(operator);
	}

	get currentOperator() {
		return this.currentOperatorSubject.getValue();
	}

	//**add
	public add(request: ObjRequestCommand): void {
		this._buildExpressionString(request.operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
	}

	//**Subtract */
	public subtract(request: ObjRequestCommand): void {
		this._buildExpressionString(request.operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
	}

	//**Multiply */
	public multiply(request: ObjRequestCommand): void {
		this._buildExpressionString(request.operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
	}

	//**Divide */
	public divide(request: ObjRequestCommand): void {
		this._buildExpressionString(request.operands);
		this._executeExpression(this._removeTrailingSymbols(this._expressionEvalBuilder));
	}

	//**Divide percent */
	public dividePercent(operands: number[] | number): void {}

	//**convert to decimal */
	public convertToDecimal(number: number): number {
		throw new Error('');
	}

	//**Switch absolute
	public switchAbsoluteValue(number: number): void {
		throw new Error('');
	}

	public clean(): void {
		this.isClear = true;
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
		this.result = 0;
	}

	public backspace(operand: number) {
		let strInput = operand.toString();
		if (strInput.length === 1) {
			return 0;
		}
		strInput = strInput.slice(0, -1);
		return parseInt(strInput);
	}

	//**equal command
	public endCalculation(): string {
		//?? wrong here
		if (this._expressionBuilder.length <= 0) {
			return '';
		}
		this._expressionBuilder = this._removeTrailingSymbols(this._expressionBuilder);
		let completeHistory = (this._expressionBuilder += ` = ${this.result.toFixed(1)}`);
		//reset string builder
		this._expressionBuilder = '';
		this._expressionEvalBuilder = '';
		this._isResultDisplayed = true;
		console.log(completeHistory);
		return completeHistory;
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
