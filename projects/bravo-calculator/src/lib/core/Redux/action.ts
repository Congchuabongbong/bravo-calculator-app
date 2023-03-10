import { EOperatorType } from '../data-type/type.enum';
import { CalculatorPayload } from '../data-type/type.interface';

export function creatorAction(type: EOperatorType, payload: CalculatorPayload) {
	return { type, payload };
}
