export function formatNumber(numberStr: string, symbol: string = ' '): string {
	let formattedStr = '';
	for (let i = numberStr.length - 1; i >= 0; i--) {
		const char = numberStr[i];
		formattedStr = char + formattedStr;
		if ((numberStr.length - i) % 3 === 0 && i > 0) {
			formattedStr = symbol + formattedStr;
		}
	}
	return formattedStr;
}

export function unformattedNumber(formattedNumber: string): number {
	if (formattedNumber.length <= 0) throw new Error('Can not unformatted number');
	return parseFloat(formattedNumber.replace(/ /g, ''));
}
