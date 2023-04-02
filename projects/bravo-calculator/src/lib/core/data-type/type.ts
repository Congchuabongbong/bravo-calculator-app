import { EGroupMenu, EKeyCmdOption, EOperatorType, EOptionCmd } from './enum';

export interface IReducer<S, P> {
	reduce(state: S, payload: P): S;
}
export interface ICommand {
	execute: () => void;
	undo?: () => void;
	cancel?: () => void;
}

export type ObjRequestCommand = {
	operands: string[] | string;
	isRebuildExpression?: boolean;
};

//TODO: optimized type state and payload for store to update into reducer
export type CalculatorAction = {
	type: EOperatorType;
	payload?: ICalculatorPayload;
};

export interface ICalculatorState {
	calculationHistories: string[]; // This is optional as it's not used in all actions
	currentExpression: string;
	result: number;
}

export interface ICalculatorPayload extends ICalculatorState {}

export type OptionsMenu = {
	descCmd: string;
	keyCmd: EKeyCmdOption;
	optionsCmd: OptionCmd[];
};

export type OptionCmd = { name: string; value: boolean; group: EGroupMenu; optCmdKey: EOptionCmd };
