export enum EOperatorString {
    Addition = ' + ',
    Subtraction = ' - ',
    Multiplication = ' x ',
    Division = ' ÷ ',
    Equal = ' = ',
    DivisionPercent = '',
}

export enum EOperatorEVal {
    Addition = ' + ',
    Subtraction = ' - ',
    Multiplication = ' * ',
    Division = ' / ',
    Equal = ' = ',
    Decimal = ' . ',
    Abs = 'abs',
}

export enum EEvenKey {
    Addition = '+',
    Subtraction = '-',
    Multiplication = '*',
    Division = '/',
    DivisionPercent = '%',
    Equal = '=',
    Decimal = '.',
    Abs = 'abs',
    BackSpace = 'Backspace',
    Esc = 'Escape',
    Enter = 'Enter',
    One = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
}

export enum EInputAction {
    Event,
    Signal,
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

export enum EFormatSymbol {
    Comma = ',',
    Dots = '.',
    Space = ' ',
}

export enum ECalculationChannel {
    StateCommunication = 'StateCommunication',
    DataCommunication = 'DataCommunication',
}
