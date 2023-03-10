import { EOperatorType } from '../data-type/type.enum';
import { CalculatorPayload, CalculatorState, Reducer } from '../data-type/type.interface';

export class CalculatorReducer implements Reducer<CalculatorState, CalculatorPayload> {
	public reduce(state: CalculatorState, action: CalculatorPayload): CalculatorState {
		switch (action.type) {
			case EOperatorType.Add:
				const newState: CalculatorState = {
					...state,
					...action,
				};
				return newState;
			case EOperatorType.Subtract:
				return state;
			case EOperatorType.Multiple:
				return state;
			case EOperatorType.Divide:
				return state;
			case EOperatorType.DividePercent:
				return state;
			case EOperatorType.Decimal:
				return state;
			case EOperatorType.Absolute:
				return state;
			case EOperatorType.Backspace:
				return state;
			case EOperatorType.Clean:
				return state;
			default:
				return state;
		}
	}
}
