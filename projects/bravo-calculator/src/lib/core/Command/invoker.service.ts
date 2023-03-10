import { Inject, Injectable } from '@angular/core';
import { RECEIVER_TOKEN } from '../../init-app/token';
import { Store } from '../redux/store.service';
import { CalculatorReceiver } from './receiver';
import { EOperatorType } from '../data-type/type.enum';
import { CalculatorPayload, CalculatorState, ICommand } from '../data-type/type.interface';
import { AddCommand } from './concrete-command';

@Injectable()
export class CalculatorInvoker {
	private _commandHistory: ICommand[] = [];
	private _currentIndex: number = -1;
	private _stringCommandHistory: string[] = [];
	constructor(private _store: Store<CalculatorState, CalculatorPayload>, @Inject(RECEIVER_TOKEN) private _receiver: CalculatorReceiver) {}

	public add(operands: number[]) {
		const command = new AddCommand(this._receiver, operands);
		this._executeCommand(command, EOperatorType.Add);
	}

	//execute command end dispatch update state into store!
	private _executeCommand(command: ICommand, type: EOperatorType): void {
		//execute command
		command.execute();
		const payload = this._generatorPayload(type);
		this._store.dispatch(payload);
	}
	//
	public get currentValue(): number {
		return this._receiver.currentValue;
	}
	//
	private _generatorPayload(type: EOperatorType): CalculatorPayload {
		const payload: Partial<CalculatorPayload> = {};
		payload.currentValue = this.currentValue;
		payload.result = this.currentValue;
		payload.type = type;
		payload.calculationHistories = this._stringCommandHistory;
		return payload as CalculatorPayload;
	}
}
