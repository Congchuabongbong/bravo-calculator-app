export enum EOperatorType {
	Add = 'Add',
	Subtract = 'Subtract',
	Multiple = 'Multiple',
	Divide = 'Divide',
	DividePercent = 'DividePercent',
	Clean = 'Clean',
	Backspace = 'Backspace',
	Result = 'Result',
	Decimal = 'Decimal',
	Absolute = 'Absolute',
	Equals = 'Equals',
}

export enum EOperatorString {
	Addition = ' + ',
	Subtraction = ' - ',
	Multiplication = ' x ',
	Division = ' ÷ ',
	Equal = ' = ',
}

export enum EOperatorEVal {
	Addition = ' + ',
	Subtraction = ' - ',
	Multiplication = ' * ',
	Division = ' / ',
}

export enum EInputAction {
	Type,
	Select,
	Click,
}

export enum EKeyCmdOption {
	Escape,
	Enter,
	Other,
}

export enum EGroupMenu {
	Default,
	Group1,
	Group2,
	Group3,
}

export enum EOptionCmd {
	Nothing,
	ClearAll,
	Clear,
	HideCalculation,
	SwitchWindow,
	Calculate,
	CalculateAndPaste,
	AutoCalculate,
}
