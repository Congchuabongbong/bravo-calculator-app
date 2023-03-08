import { ICommand } from './ICommand';

//handle logic here
export class Calculator {
	private _currentValue: number = 0;

	public add(numbers: number[]): void {}
	public subtract(numbers: number[]): void {}
	public multiply(numbers: number[]): void {}
	public divide(numbers: number[]): void {}
	public dividePercent(numbers: number[]): void {}
	public clean!: (numbers: number[], history: ICommand[]) => void;
	public backspace(numbers: number[]): void {}
	public getResult(numbers: number[]): void {}
	public convertToDecimal(numbers: number[]): void {}
	public switchAbsoluteValue(numbers: number[]): void {}

	public get CurrentValue(): number {
		return this._currentValue;
	}
	public set CurrentValue(value: number) {
		this._currentValue = value;
	}
}
