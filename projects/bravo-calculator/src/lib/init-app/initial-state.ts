import { CalculatorReceiver } from '../core/command/receiver';
import { ICalculatorState } from '../core/data-type/type';

export const initialStateCalculator: ICalculatorState = {
	result: 0,
	calculationHistories: [],
	currentExpression: '',
};

export const calculatorReceiver = new CalculatorReceiver();
