import { EInputAction, EOperatorString, EOperatorType } from '../data-type/enum';
import { ObjRequestCommand } from '../data-type/type';
//handle logic here

export class CalculatorReceiver {
	public currentValue: number = 0;
	public result: number = this.currentValue;
	public isClear: boolean = false;
	public isReset: boolean = false;
	private _isStartCalculate: boolean = false;
	private _isEndCalculate: boolean = false;
	public historyStringBuilder: string = '';

	public add(request: ObjRequestCommand, isAbsolute: boolean = false): void {
		this._isEndCalculate = false;
		if (request.inputType === EInputAction.Click || request.inputType === EInputAction.Type) {
			const operand = request.operands as number;
			this.currentValue = operand;
			this.result += operand;
		} else {
			this.result = (request.operands as number[]).reduce((acc, val) => (acc += val), this.result);
			this.currentValue = this.result;
		}
		this._buildCalculationString(request.operands, EOperatorType.Add);
	}
	public subtract(operands: number[] | number): void {
		//analysis action
		this._buildCalculationString(operands, EOperatorType.Subtract);
	}
	public multiply(operands: number[] | number): void {
		//analysis action
		this._buildCalculationString(operands, EOperatorType.Multiple);
	}
	public divide(operands: number[] | number): void {
		//analysis action
		this._buildCalculationString(operands, EOperatorType.Divide);
	}
	public dividePercent(operands: number[] | number): void {
		//analysis action
		this._buildCalculationString(operands, EOperatorType.DividePercent);
	}

	public convertToDecimal(number: number[]): void {
		//analysis action
	}

	public switchAbsoluteValue(number: number): void {
		this.currentValue = Math.abs(number);
	}

	public clean(): void {
		this.isClear = true;
		this._isEndCalculate = false;
		this.historyStringBuilder = '';
		this.currentValue = 0;
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
		this.historyStringBuilder = this._removeTrailingSymbols(this.historyStringBuilder);
		let completeHistory = (this.historyStringBuilder += ` = ${this.result}`);
		this.historyStringBuilder = '';
		this._isEndCalculate = true;
		this.currentValue = this.result;
		return completeHistory;
	}

	private _buildCalculationString(operands: number[] | number, type: EOperatorType, isAbsolute: boolean = false) {
		let operator: string;
		switch (type) {
			case EOperatorType.Add:
				operator = EOperatorString.Addition;
				break;
			case EOperatorType.Subtract:
				operator = EOperatorString.Subtraction;
				break;
			case EOperatorType.Multiple:
				operator = EOperatorString.Multiplication;
				break;
			case EOperatorType.Divide:
				operator = EOperatorString.Division;
				break;
			default:
				operator = ' + ';
		}
		let equation;
		if (typeof operands === 'object') {
			equation = operands.map(val => val.toFixed(1)).join(operator);
			equation = '('.concat(equation).concat(')');
			equation += operator;
		} else equation = operands + operator;
		this.historyStringBuilder += equation;
	}

	private _removeTrailingSymbols(input: string): string {
		const ending = input.slice(-3);
		if (ending === EOperatorString.Addition || ending === EOperatorString.Division || ending === EOperatorString.Multiplication || ending === EOperatorString.Subtraction) {
			return input.slice(0, -3);
		}
		return input;
	}
}
