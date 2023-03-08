import { ICommand } from './ICommand';
import { Calculator } from './receiver';

export class AddCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.add(this._value);
	}
}

export class SubtractCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.subtract(this._value);
	}
}

export class MultiplyCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.multiple(this._value);
	}
}

export class DivideCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.divide(this._value);
	}
}

export class DividePercentCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.dividePercent(this._value);
	}
}

// class ClearCommand implements ICommand {
// 	private _calculator!: Calculator;
// 	private _history!: ICommand[];
// 	private _value: number = 0;
// 	constructor(calculatorReceiver: Calculator, value: number, history: ICommand[]) {
// 		this._calculator = calculatorReceiver;
// 		this._history = history;
// 	}
// 	public execute() {
// 		this._calculator.clean(this._value, this._history);
// 	}
// }

class BackSpaceCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.backspace(this._value);
	}
}

// class ResultCommand implements ICommand {
// 	private _calculator!: Calculator;
// 	private _value!: number;
// 	constructor(calculatorReceiver: Calculator, value: number) {
// 		this._calculator = calculatorReceiver;
// 		this._value = value;
// 	}
// 	public execute() {

//     }
// }

class DecimalCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.convertToDecimal(this._value);
	}
}

class AbsoluteCommand implements ICommand {
	private _calculator!: Calculator;
	private _value!: number;
	constructor(calculatorReceiver: Calculator, value: number) {
		this._calculator = calculatorReceiver;
		this._value = value;
	}
	public execute() {
		this._calculator.switchAbsoluteValue(this._value);
	}
}
