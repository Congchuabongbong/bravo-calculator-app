import { EOperatorType, EInputAction } from '../data-type/enum';
import { CalculatorAction, CalculatorPayload } from '../data-type/type';

export function creatorAction(type: EOperatorType, payload: CalculatorPayload, inputType: EInputAction = EInputAction.Click): CalculatorAction {
	return { type, payload, inputType };
}
