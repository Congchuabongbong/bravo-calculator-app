import { ICommand } from './../command/ICommand';

import { EOperatorType } from '../data-type/enum';

type AppState = {
	initValue: number;
	type: EOperatorType;
	currentValue: number;
	result: number;
	history: ICommand[];
};

const initialState: AppState = {
	initValue: 0,
	currentValue: 0,
	result: 0,
	history: [],
	type: EOperatorType.Add,
};

type Payload = {
	numbers: number[];
	type: EOperatorType;
	command: ICommand;
};

//reducer combine with receiver handle logic and update state
const reducer = (state: AppState, payload: any) => {};
