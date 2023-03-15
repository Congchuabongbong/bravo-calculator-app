import { ICommand, ObjRequestCommand } from '../../data-type/type';
import { CalculatorReceiver } from '../receiver';

export class SubtractCommand implements ICommand {
	private _receiver!: CalculatorReceiver;
	private _request!: ObjRequestCommand;
	constructor(calculatorReceiver: CalculatorReceiver, request: ObjRequestCommand) {
		this._receiver = calculatorReceiver;
		this._request = request;
	}
	public execute(): void {
		this._receiver.subtract(this._request);
	}
}
