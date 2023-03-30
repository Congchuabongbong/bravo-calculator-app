import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '../utils';
import { unformattedNumber } from '../utils/functions.util';

@Pipe({
	name: 'thousandsSeparator',
})
export class ThousandsSeparatorPipe implements PipeTransform {
	transform(value: string): string {
		if (value.length <= 0) return value;
		else if (unformattedNumber(value).length > 29) return unformattedNumber(value);
		let decimalPart = '';
		if (value.includes('.')) {
			const parts = value.split('.');
			value = parts[0];
			decimalPart = parts[1];
			return `${formatNumber(value.replace(/ /g, ''))}.${decimalPart}`;
		}
		return formatNumber(value.replace(/ /g, ''));
	}
}
