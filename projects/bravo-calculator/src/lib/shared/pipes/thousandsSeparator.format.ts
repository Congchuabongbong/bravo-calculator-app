import { Pipe, PipeTransform } from '@angular/core';
import * as bigInt from 'big-integer';

@Pipe({
	name: 'thousandsSeparator',
})
export class ThousandsSeparatorPipe implements PipeTransform {
	transform(value: string): string {
		if (value.length <= 0) return '';
		let number = 0;
		let decimalStr = '';
		if (value.includes('.')) {
			number = this.parseBigInt(value.split('.')[0].replace(/ /g, '')) || 0;
			decimalStr = value.split('.')[1].replace(/ /g, '') || '';
		} else {
			number = this.parseBigInt(value.replace(/ /g, ''));
		}
		if (isNaN(number)) return '';
		const formattedNumber = number.toLocaleString('en-US', { useGrouping: true });
		const formattedNumberWithSpaces = formattedNumber.replace(/,/g, ' ');
		return formattedNumberWithSpaces;
	}

	private parseBigInt(str: string) {
		const base = 10;
		let num = 0;
		for (let i = 0; i < str.length; i++) {
			const digit = parseInt(str[i], base);
			if (!isNaN(digit)) {
				num = num * base + digit;
			}
		}
		return num;
	}
}
