export function formatNumberWithSpaces(number: string): string {
	if (isNaN(parseFloat(number))) throw new Error(`Invalid number: ${number}`);
	const formattedNumber = parseFloat(number).toLocaleString('en-US', { useGrouping: true });
	const formattedNumberWithSpaces = formattedNumber.replace(/,/g, ' ');
	return formattedNumberWithSpaces;
}

export function unformattedNumber(formattedNumber: string): number {
	if (formattedNumber.length <= 0) throw new Error('Can not unformatted number');
	return parseFloat(formattedNumber.replace(/ /g, ''));
}
