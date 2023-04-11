import { EGroupMenu, EKeyCmdOption, EOperatorString, EOptionCmd } from './enum';

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
	operator: EOperatorString;
};

export type OptionsMenu = {
	descCmd: string;
	keyCmd: EKeyCmdOption;
	optionsCmd: OptionCmd[];
};

export type OptionCmd = { name: string; value: boolean; group: EGroupMenu; optCmdKey: EOptionCmd };

export type PayloadChannel = {
	gridId: number;
	operands: string[];
};

export type StatusCalculator = {
	isTurnOn: boolean;
};
