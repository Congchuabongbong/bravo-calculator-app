import { CalculatorReceiver } from '../core/command/receiver';
import { ICalculatorState } from '../core/data-type/type';

export const initialStateCalculator: ICalculatorState = {
	displayValue: 0,
	prevValue: 0,
	calculationHistories: [],
	currentOperationAsString: '',
	isReset: false,
};

export const calculatorReceiver = new CalculatorReceiver();
