import { Inject, Injectable } from '@angular/core';
import { RECEIVER_TOKEN } from '../../init-app/token';
import { EOperatorType } from '../data-type/enum';
import { CalculatorAction, ICalculatorPayload, ICalculatorState, ICommand } from '../data-type/type';
import { Store } from '../redux/store.service';
import { AddCommand, DividePercentCommand } from './concrete-command';
import { DivideCommand } from './concrete-command/divide.command.class';
import { EqualCommand } from './concrete-command/equal.command.class';
import { MultiplyCommand } from './concrete-command/multiply.command.class';
import { SubtractCommand } from './concrete-command/subtract.command.class';
import { CalculatorReceiver } from './receiver';

@Injectable()
export class CalculatorInvoker {
	constructor(private _store: Store<ICalculatorState, CalculatorAction>, @Inject(RECEIVER_TOKEN) private _receiver: CalculatorReceiver) {}

	public addAction(operands: string[] | string, isRebuildExpression: boolean = false) {
		const command = new AddCommand(this._receiver, { operands, isRebuildExpression });
		this._executeCommand(command, EOperatorType.Add);
	}

	public subtractAction(operands: string[] | string) {
		const command = new SubtractCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Subtract);
	}

	public multiplyAction(operands: string[] | string) {
		const command = new MultiplyCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Multiple);
	}

	public divideAction(operands: string[] | string) {
		const command = new DivideCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Divide);
	}

	public endCalculationAction(operands: string[] | string) {
		const command = new EqualCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Equals);
	}

	public clearAction(isClearAll: boolean = false) {
		this._receiver.handleClean(isClearAll);
	}

	public dividePercentAction(operands: string[] | string = '') {
		let command;
		command = new DividePercentCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.DividePercent);
	}

	//execute command end dispatch update state into store!
	private _executeCommand(command: ICommand, type: EOperatorType): void {
		//execute command
		command.execute();

		//dispatch store update
	}

	get currentExpression() {
		return this._receiver.expressionStringBuilder;
	}

	get calculationHistories(): string[] {
		return this._receiver.calculationHistories;
	}

	public set isNexOperator(flag: boolean) {
		this._receiver.isNextOperator = flag;
	}

	public set isDeleteResultDisplay(flag: boolean) {
		this._receiver.isDeleteResultDisplay = flag;
	}

	public get isDeleteResultDisplay() {
		return this._receiver.isDeleteResultDisplay;
	}

	public get result(): string {
		return this._receiver.result;
	}

	private creatorPayload(): ICalculatorPayload {
		throw new Error('');
		// const payload: Partial<ICalculatorPayload> = {};
		// payload.result = this.result;
		// payload.calculationHistories = this._receiver.calculationHistories;
		// payload.currentExpression = this._receiver.expressionStringBuilder;
		// return payload as ICalculatorPayload;
	}
}
