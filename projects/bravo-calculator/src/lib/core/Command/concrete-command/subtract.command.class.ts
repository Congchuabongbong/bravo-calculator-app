import { ICommand } from '../../data-type/type';
import { CalculatorReceiver } from '../receiver';

export class SubtractCommand implements ICommand {
	private _receiver!: CalculatorReceiver;
	private _operands!: number[] | number;
	constructor(calculatorReceiver: CalculatorReceiver, operands: number[] | number) {
		this._receiver = calculatorReceiver;
		this._operands = operands;
	}
	public execute(): void {}
}
