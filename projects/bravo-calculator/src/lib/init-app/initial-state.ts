import { CalculatorReceiver } from '../core/command/receiver';
import { CalculatorState } from '../core/data-type/type.interface';

export const initialStateCalculator: CalculatorState = {
	initValue: 0,
	currentValue: 0,
	result: 100,
	calculationHistories: [],
	isReset: false,
	isInteract: false,
	isEndCalculate: false,
};

export const calculatorReceiver = new CalculatorReceiver();
