import { Inject, Injectable } from '@angular/core';
import { RECEIVER_TOKEN } from '../../init-app/token';
import { EInputAction, EOperatorString, EOperatorType } from '../data-type/enum';
import { CalculatorAction, CalculatorPayload, ICalculatorState, ICommand } from '../data-type/type';
import { Store } from '../redux/store.service';
import { AddCommand } from './concrete-command';
import { CalculatorReceiver } from './receiver';
import { DivideCommand } from './concrete-command/divide.command.class';

@Injectable()
export class CalculatorInvoker {
	private _commandHistory: ICommand[] = [];
	public calculationHistories: string[] = [];
	private _currentIndex: number = -1;
	private _stringCommandHistory: string[] = [];
	public isAllowSwitchOperator!: boolean; // khi nào được được switchOperator => Phải có một cờ cho phép
	constructor(private _store: Store<ICalculatorState, CalculatorAction>, @Inject(RECEIVER_TOKEN) private _receiver: CalculatorReceiver) {}

	public add(operands: number[] | number = 0, inputType: EInputAction = EInputAction.Click) {
		const command = new AddCommand(this._receiver, { inputType, operands });
		this._executeCommand(command, EOperatorType.Add);
	}

	public divide(operands: number[] | number = 0, inputType: EInputAction = EInputAction.Click) {
		const command = new DivideCommand(this._receiver, { inputType, operands });
		this._executeCommand(command, EOperatorType.Divide);
	}
	public endCalculation() {
		let calculationHistory = this._receiver.endCalculation();
		if (this.calculationHistories.length < 5 && calculationHistory.length > 0) this.calculationHistories.push(calculationHistory);
		else if (this.calculationHistories.length > 5) {
			this.calculationHistories.shift();
			this.calculationHistories.push(calculationHistory);
		}
		console.log(this.calculationHistories);
	}

	//execute command end dispatch update state into store!
	private _executeCommand(command: ICommand, type: EOperatorType): void {
		//execute command
		command.execute();
		//dispatch store update
	}

	//!!test
	getCurrentExpression() {
		return this._receiver._expressionBuilder;
	}

	setCurrentOperator(operator: EOperatorString) {
		this._receiver.setCurrentOperator(operator);
	}

	switchOperator() {
		this._receiver.switchOperator();
	}

	public get result(): number {
		return this._receiver.result;
	}

	private creatorPayload(): CalculatorPayload {
		const payload: Partial<CalculatorPayload> = {};
		payload.result = this.result;
		payload.calculationHistories = this._stringCommandHistory;
		return payload as CalculatorPayload;
	}
}
