export function formatNumber(numberStr: string, symbol: string = ' '): string {
	let formattedStr = '';
	let minus = '';
	if (numberStr.includes('-')) {
		numberStr = numberStr.replace('-', '');
		minus = '-';
	}
	for (let i = numberStr.length - 1; i >= 0; i--) {
		const char: any = numberStr[i];
		formattedStr = char + formattedStr;
		if ((numberStr.length - i) % 3 === 0 && i > 0) {
			formattedStr = symbol + formattedStr;
		}
	}
	return minus.concat(formattedStr);
}

export function unformattedNumber(formattedNumber: string): number {
	if (formattedNumber.length <= 0) throw new Error('Can not unformatted number');
	return parseFloat(formattedNumber.replace(/ /g, ''));
}

export function isInt(val: number) {
	return Number(val) === val && val % 1 === 0;
}
