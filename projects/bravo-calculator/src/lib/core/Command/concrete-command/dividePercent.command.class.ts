import { ICommand } from '../../data-type/type.interface';
import { CalculatorReceiver } from '../receiver';
export class DividePercentCommand implements ICommand {
	private _receiver!: CalculatorReceiver;
	private _operands!: number[];
	constructor(calculatorReceiver: CalculatorReceiver, operands: number[]) {
		this._receiver = calculatorReceiver;
		this._operands = operands;
	}
	public execute (): void {

	}
}
