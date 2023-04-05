import { Injectable } from '@angular/core';
import { EInputAction, EOperatorString } from '../data-type/enum';
import { ICommand } from '../data-type/type';
import { AddCommand, DivideCommand, DividePercentCommand, EqualCommand, MultiplyCommand, SignalCommand, SubtractCommand } from './concrete-command';
import { CalculatorReceiver } from './receiver';

@Injectable()
export class CalculatorInvoker {
	private _receiver!: CalculatorReceiver;

	constructor() {
		this._receiver = new CalculatorReceiver();
	}

	public addAction(operands: string[] | string) {
		const command = new AddCommand(this._receiver, { operands, operator: EOperatorString.Addition });
		this._executeCommand(command);
	}

	public subtractAction(operands: string[] | string) {
		const command = new SubtractCommand(this._receiver, { operands, operator: EOperatorString.Subtraction });
		this._executeCommand(command);
	}

	public multiplyAction(operands: string[] | string) {
		const command = new MultiplyCommand(this._receiver, { operands, operator: EOperatorString.Multiplication });
		this._executeCommand(command);
	}

	public divideAction(operands: string[] | string) {
		const command = new DivideCommand(this._receiver, { operands, operator: EOperatorString.Division });
		this._executeCommand(command);
	}

	public dividePercentAction(operands: string[] | string = '') {
		let command = new DividePercentCommand(this._receiver, { operands, operator: EOperatorString.DivisionPercent });
		this._executeCommand(command);
	}

	public handleSignalAction(operator: EOperatorString, operands: string[] = []) {
		let command = new SignalCommand(this._receiver, { operands, operator });
		this._executeCommand(command);
	}

	public endCalculationAction(operands: string[] | string) {
		const command = new EqualCommand(this._receiver, { operands, operator: EOperatorString.Equal });
		this._executeCommand(command);
	}

	public clearAction(isClearAll: boolean = false) {
		this._receiver.handleClean(isClearAll);
	}

	//execute command end dispatch update state into store!
	private _executeCommand(command: ICommand): void {
		//execute command
		command.execute();
	}

	get currentExpression() {
		return this._receiver.expressionStringBuilder;
	}

	get calculationHistories(): string[] {
		return this._receiver.calculationHistories;
	}

	public set isNextOperator(flag: boolean) {
		this._receiver.isNextOperator = flag;
	}

	public get isNextOperator() {
		return this._receiver.isNextOperator;
	}

	public set isNextSignal(flag: boolean) {
		this._receiver.isNextSignal = flag;
	}

	public get isNextSignal() {
		return this._receiver.isNextSignal;
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

	get currentInputAction(): EInputAction {
		return this._receiver.currentInputAction;
	}

	set currentInputAction(inputAct: EInputAction) {
		this._receiver.currentInputAction = inputAct;
	}
}
