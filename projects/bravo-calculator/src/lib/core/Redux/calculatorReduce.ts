import { initialStateCalculator } from '../../init-app/initial-state';
import { EOperatorType } from '../data-type/enum';
import { CalculatorAction, ICalculatorState, IReducer } from '../data-type/type';

//**update state for store here
//TODO: handle update state for store app base on the action
export class CalculatorReducer implements IReducer<ICalculatorState, CalculatorAction> {
	public reduce(state: ICalculatorState = initialStateCalculator, action: CalculatorAction): ICalculatorState {
		switch (action.type) {
			case EOperatorType.Add:
				const newState: ICalculatorState = {
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
