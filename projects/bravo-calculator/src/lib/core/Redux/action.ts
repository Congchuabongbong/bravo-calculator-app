import { EOperatorType, EInputAction } from '../data-type/enum';
import { CalculatorAction, ICalculatorPayload } from '../data-type/type';

export function creatorAction(type: EOperatorType, payload: ICalculatorPayload, inputType: EInputAction = EInputAction.Click): CalculatorAction {
	return { type, payload };
}
