import { EOperatorType } from './type.enum';

export interface Reducer<S, P> {
	reduce(state: S, payload: P): S;
}
export interface ICommand {
	execute: () => void;
	undo?: () => void;
	cancel?: () => void;
}

export interface CalculatorPayload extends Omit<CalculatorState, 'isReset | isInteract | isEndCalculate'> {
	type: EOperatorType;
}

export interface CalculatorState {
	calculationHistories: string[];
	result: number;
	initValue: number;
	currentValue: number;
	isReset: boolean;
	isInteract: boolean;
	isEndCalculate: boolean;
}
