import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '../utils';

@Pipe({
	name: 'thousandsSeparator',
})
export class ThousandsSeparatorPipe implements PipeTransform {
	transform(value: string): string {
		if (value.length <= 0) return '';
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
