import { EInputAction, EOperatorType } from './enum';

export interface IReducer<S, P> {
	reduce(state: S, payload: P): S;
}
export interface ICommand {
	execute: () => void;
	undo?: () => void;
	cancel?: () => void;
}

export type ObjRequestCommand = {
	operands: number[] | number;
};

//TODO: optimized type state and payload for store to update into reducer
export type CalculatorAction = {
	type: EOperatorType;
	inputType?: EInputAction;
	payload?: CalculatorPayload;
};

export interface ICalculatorState {
	calculationHistories: string[];
	currentOperationAsString: string;
	displayValue: string | number;
	prevValue: string | number;
	isReset: boolean;
}

export type CalculatorPayload = {
	calculationHistories: string[]; // This is optional as it's not used in all actions
	currentExpression: string;
	result: number;
};
