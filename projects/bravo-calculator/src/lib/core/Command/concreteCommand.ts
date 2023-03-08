import { ICommand } from './ICommand';
import { Calculator } from './receiver';

export class AddCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.add(this._numbers);
	}
}

export class SubtractCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.subtract(this._numbers);
	}
}

export class MultiplyCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.multiply(this._numbers);
	}
}

export class DivideCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.divide(this._numbers);
	}
}

export class DividePercentCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.dividePercent(this._numbers);
	}
}

class BackSpaceCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.backspace(this._numbers);
	}
}

class DecimalCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.convertToDecimal(this._numbers);
	}
}

class AbsoluteCommand implements ICommand {
	private _calculator!: Calculator;
	private _numbers!: number[];
	constructor(calculatorReceiver: Calculator, value: number[]) {
		this._calculator = calculatorReceiver;
		this._numbers = value;
	}
	public execute() {
		this._calculator.switchAbsoluteValue(this._numbers);
	}
}
