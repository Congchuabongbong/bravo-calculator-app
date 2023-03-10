//handle logic here

export class CalculatorReceiver {
	public currentValue: number = 0;
	public isClearValue: boolean = false;
	public isEndCalculate: boolean = false;
	public add(operands: number[]): void {}
	public subtract(operands: number[]): void {}
	public multiply(operands: number[]): void {}
	public divide(operands: number[]): void {}
	public dividePercent(operands: number[]): void {}
	public clean(): void {
		this.isClearValue = true;
		this.currentValue = 0;
	}
	public backspace(operands: number[]): void {}
	public getResult(operands: number[]): void {}
	public convertToDecimal(operands: number[]): void {}
	public switchAbsoluteValue(operands: number[]): void {}
}
