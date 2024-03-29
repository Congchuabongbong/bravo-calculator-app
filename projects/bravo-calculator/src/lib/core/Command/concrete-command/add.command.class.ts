import { ICommand, ObjRequestCommand } from '../../data-type';
import { CalculatorReceiver } from '../receiver';
export class AddCommand implements ICommand {
	private _receiver!: CalculatorReceiver;
	private _request!: ObjRequestCommand;
	constructor(calculatorReceiver: CalculatorReceiver, request: ObjRequestCommand) {
		this._receiver = calculatorReceiver;
		this._request = request;
	}
	public execute(): void {
		this._receiver.handleAddCommand(this._request);
	}
}
