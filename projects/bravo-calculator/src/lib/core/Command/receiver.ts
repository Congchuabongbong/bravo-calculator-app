import { EOperatorEVal, EOperatorString, EOperatorType } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';
//handle logic here

export class CalculatorReceiver {
	public result: number = 0;
	private _isResultDisplayed: boolean = false;
	public isClear: boolean = false;
	public isReset: boolean = false;
	private _calculationStringBuilder: string = '';
	private _calculationEvalBuilder: string = '';

	//**add
	public add(request: ObjRequestCommand, isAbsolute: boolean = false): void {
		this._buildCalculationString(request.operands, EOperatorType.Add);
		this._executeExpression(this._removeTrailingSymbols(this._calculationEvalBuilder));
	}

	//**Subtract */
	public subtract(operands: number[] | number): void {
		this._buildCalculationString(operands, EOperatorType.Subtract);
		this._executeExpression(this._removeTrailingSymbols(this._calculationEvalBuilder));
	}

	//**Multiply */
	public multiply(operands: number[] | number): void {
		this._buildCalculationString(operands, EOperatorType.Multiple);
		this._executeExpression(this._removeTrailingSymbols(this._calculationEvalBuilder));
	}

	//**Divide */
	public divide(request: ObjRequestCommand): void {
		this._buildCalculationString(request.operands, EOperatorType.Divide);
		this._executeExpression(this._removeTrailingSymbols(this._calculationEvalBuilder));
	}

	//**Divide percent */
	public dividePercent(operands: number[] | number): void {
		this._buildCalculationString(operands, EOperatorType.DividePercent);
		this._executeExpression(this._removeTrailingSymbols(this._calculationEvalBuilder));
	}

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
		this._calculationStringBuilder = '';
		this._calculationEvalBuilder = '';
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
		if (this._calculationStringBuilder.length <= 0) {
			return '';
		}
		this._calculationStringBuilder = this._removeTrailingSymbols(this._calculationStringBuilder);
		let completeHistory = (this._calculationStringBuilder += ` = ${this.result.toFixed(1)}`);
		//reset string builder
		this._calculationStringBuilder = '';
		this._calculationEvalBuilder = '';
		this._isResultDisplayed = true;
		console.log(completeHistory);
		return completeHistory;
	}
	//
	private _buildCalculationString(operands: number[] | number, type: EOperatorType, isAbsolute: boolean = false) {
		let operatorDisplay: string;
		let operatorEval: string;
		switch (type) {
			case EOperatorType.Add:
				operatorDisplay = EOperatorString.Addition;
				operatorEval = EOperatorEVal.Addition;
				break;
			case EOperatorType.Subtract:
				operatorDisplay = EOperatorString.Subtraction;
				operatorEval = EOperatorEVal.Subtraction;
				break;
			case EOperatorType.Multiple:
				operatorDisplay = EOperatorString.Multiplication;
				operatorEval = EOperatorEVal.Multiplication;
				break;
			case EOperatorType.Divide:
				operatorDisplay = EOperatorString.Division;
				operatorEval = EOperatorEVal.Division;
				break;
			default:
				operatorDisplay = EOperatorString.Addition;
				operatorEval = EOperatorEVal.Addition;
		}
		let equation;
		let equationEval;
		if (typeof operands === 'object') {
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

		this._calculationStringBuilder += equation;
		this._calculationEvalBuilder += equationEval;
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
