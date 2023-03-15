import { Inject, Injectable } from '@angular/core';
import { RECEIVER_TOKEN } from '../../init-app/token';
import { EOperatorType } from '../data-type/enum';
import { CalculatorAction, CalculatorPayload, ICalculatorState, ICommand } from '../data-type/type';
import { Store } from '../redux/store.service';
import { AddCommand } from './concrete-command';
import { DivideCommand } from './concrete-command/divide.command.class';
import { CalculatorReceiver } from './receiver';
import { SubtractCommand } from './concrete-command/subtract.command.class';
import { MultiplyCommand } from './concrete-command/multiply.command.class';

@Injectable()
export class CalculatorInvoker {
	private _commandHistory: ICommand[] = [];
	private _currentIndex: number = -1;
	public calculationHistories: string[] = [];
	private _stringCommandHistory: string[] = [];

	constructor(private _store: Store<ICalculatorState, CalculatorAction>, @Inject(RECEIVER_TOKEN) private _receiver: CalculatorReceiver) {}

	public addAction(operands: number[] | number = 0) {
		const command = new AddCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Add);
	}

	public subtractAction(operands: number | number = 0) {
		const command = new SubtractCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Subtract);
	}

	public multiplyAction(operands: number | number = 0) {
		const command = new MultiplyCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Multiple);
	}

	public divideAction(operands: number[] | number = 0) {
		const command = new DivideCommand(this._receiver, { operands });
		this._executeCommand(command, EOperatorType.Divide);
	}

	public endCalculationAction() {
		//TODO: handle last input when click endCalculator
		let calculationHistory = this._receiver.handleEndCalculation();
		if (this.calculationHistories.length < 5 && calculationHistory.length > 0) this.calculationHistories.push(calculationHistory);
		else if (this.calculationHistories.length > 5) {
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

	//!!test
	getCurrentExpression() {
		return this._receiver.expressionStringBuilder;
	}

	public setIsNexOperator(flag: boolean) {
		this._receiver.setIsNexOperator(flag);
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
