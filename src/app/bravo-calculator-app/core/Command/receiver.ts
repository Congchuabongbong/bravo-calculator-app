import { ICommand } from './ICommand';
interface ICommandAction {
	add: (value: number) => void;
	subtract: (value: number) => void;
	multiple: (value: number) => void;
	divide: (value: number) => void;
	dividePercent: (value: number) => void;
	clean: (value: number, history: ICommand[]) => void;
	backspace: (value: number) => void;
	getResult: (value: number) => void;
	convertToDecimal: (value: number) => void;
	switchAbsoluteValue: (value: number) => void;
}

//handle logic here
export class Calculator implements ICommandAction {
	private _currentValue: number = 0;
	public add!: (value: number) => void;
	public subtract!: (value: number) => void;
	public multiple!: (value: number) => void;
	public divide!: (value: number) => void;
	public dividePercent!: (value: number) => void;
	public clean!: (value: number, history: ICommand[]) => void;
	public backspace!: (value: number) => void;
	public getResult!: (value: number) => void;
	public convertToDecimal!: (value: number) => void;
	public switchAbsoluteValue!: (value: number) => void;

	public get CurrentValue(): number {
		return this._currentValue;
	}
	public set CurrentValue(value: number) {
		this._currentValue = value;
	}
}
