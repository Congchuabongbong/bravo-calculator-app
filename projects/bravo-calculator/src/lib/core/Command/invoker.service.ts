import { Inject, Injectable } from '@angular/core';
import { RECEIVER_TOKEN } from '../../init-app/token';
import { EInputAction, EOperatorType } from '../data-type/enum';
import { CalculatorAction, CalculatorPayload, ICalculatorState, ICommand } from '../data-type/type';
import { Store } from '../redux/store.service';
import { AddCommand } from './concrete-command';
import { CalculatorReceiver } from './receiver';

@Injectable()
export class CalculatorInvoker {
	private _commandHistory: ICommand[] = [];
	public calculationHistories: string[] = [];
	private _currentIndex: number = -1;
	private _stringCommandHistory: string[] = [];
	constructor(private _store: Store<ICalculatorState, CalculatorAction>, @Inject(RECEIVER_TOKEN) private _receiver: CalculatorReceiver) {}

	public add(operands: number[] | number, inputType: EInputAction = EInputAction.Click) {
		const command = new AddCommand(this._receiver, { inputType, operands });
		this._executeCommand(command, EOperatorType.Add);
	}
	public endCalculation() {
		let calculationHistory = this._receiver.endCalculation();
		if (this.calculationHistories.length < 5) this.calculationHistories.push(calculationHistory);
		else {
			this.calculationHistories.shift();
			this.calculationHistories.push(calculationHistory);
		}
	}

	//execute command end dispatch update state into store!
	private _executeCommand(command: ICommand, type: EOperatorType): void {
		//execute command
		command.execute();
		//dispatch store update
	}

	public get currentValue(): number {
		return this._receiver.currentValue;
	}

	public get result(): number {
		return this._receiver.result;
	}

	private creatorPayload(): CalculatorPayload {
		const payload: Partial<CalculatorPayload> = {};
		payload.currentValue = this.currentValue;
		payload.result = this.currentValue;
		payload.calculationHistories = this._stringCommandHistory;
		return payload as CalculatorPayload;
	}
}
