import { EFormatSymbol } from '../../core/data-type/enum';

export function formatNumber(numberStr: string, symbolFormat: EFormatSymbol = EFormatSymbol.Space, isReFormatOrigin: boolean = false, currentSymbol?: EFormatSymbol): string {
	let formattedStr = '';
	let minus = '';
	if (isReFormatOrigin && currentSymbol) {
		debugger;
		numberStr = unformattedNumber(numberStr, currentSymbol);
	}
	if (numberStr.includes('-')) {
		numberStr = numberStr.replace('-', '');
		minus = '-';
	}
	for (let i = numberStr.length - 1; i >= 0; i--) {
		const char: any = numberStr[i];
		formattedStr = char + formattedStr;
		if ((numberStr.length - i) % 3 === 0 && i > 0) {
			formattedStr = symbolFormat + formattedStr;
		}
	}
	return minus.concat(formattedStr);
}

export function unformattedNumber(formattedNumber: string, symbol: EFormatSymbol = EFormatSymbol.Space): string {
	if (formattedNumber.length <= 0) throw new Error('Can not unformatted number');
	let regex;
	switch (symbol) {
		case EFormatSymbol.Comma:
			regex = /,/g;
			break;
		case EFormatSymbol.Space:
			regex = / /g;
			break;
		default:
			regex = / /g;
			break;
	}
	return formattedNumber.replace(regex, '');
}

export function isInt(val: number) {
	return Number(val) === val && val % 1 === 0;
}

export function isIntStr(numberStr: string): boolean {
	if (numberStr.length === 0) return false;
	return numberStr.includes('.');
}

export function convertStrFormatType(numberStr: string): string {
	if (numberStr.length <= 0) return '';
	return numberStr.includes('.') ? numberStr : numberStr.concat('.0');
}
