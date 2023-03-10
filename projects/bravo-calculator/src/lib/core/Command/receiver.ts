import { EOperatorType } from '../data-type/type.enum';
//handle logic here

export class CalculatorReceiver {
	public currentValue: number = 0;
	public isClearValue: boolean = false;
	public isEndCalculate: boolean = false;
	public historyString!: string;
	public add(operands: number[]): void {
		//analysis action
		this.currentValue = operands.reduce((acc, value) => (acc += value), this.currentValue);
		this._buildArithmeticOperationsString(operands, EOperatorType.Add);
	}
	public subtract(operands: number[]): void {
		//analysis action
		this._buildArithmeticOperationsString(operands, EOperatorType.Subtract);
	}
	public multiply(operands: number[]): void {
		//analysis action
		this._buildArithmeticOperationsString(operands, EOperatorType.Multiple);
	}
	public divide(operands: number[]): void {
		//analysis action
		this._buildArithmeticOperationsString(operands, EOperatorType.Divide);
	}
	public dividePercent(operands: number[]): void {
		//analysis action
		this._buildArithmeticOperationsString(operands, EOperatorType.DividePercent);
	}

	public convertToDecimal(number: number[]): void {
		//analysis action
	}

	public switchAbsoluteValue(number: number[]): void {
		//analysis action
	}

	public clean(): void {
		this.isClearValue = true;
		this.isEndCalculate = false;
		this.historyString = '';
		this.currentValue = 0;
	}

	public backspace(operand: number) {
		let strInput = operand.toString();
		if (strInput.length === 1) {
			return 0;
		}
		strInput = strInput.slice(0, -1);
		return parseInt(strInput);
	}

	public getResult(operands: number[]): void {
		//analysis action
	}

	public endCalculate() {
		this.isEndCalculate = true;
		this.historyString = '';
	}

	private _buildArithmeticOperationsString(operands: number[], type: EOperatorType) {
		this.historyString = '';
		let operator: string;
		switch (type) {
			case EOperatorType.Add:
				operator = ' + ';
				break;
			case EOperatorType.Subtract:
				operator = ' - ';
				break;
			default:
				operator = ' + ';
		}
		const equation = operands.join(operator);
		this.historyString = this.isEndCalculate ? `${equation} = ${this.currentValue}` : equation + operator;
	}
}
