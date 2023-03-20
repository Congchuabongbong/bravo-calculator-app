import { Pipe, PipeTransform } from '@angular/core';
import { formatNumberWithSpaces, unformattedNumber } from '../utils';

@Pipe({
	name: 'thousandsSeparator',
})
export class ThousandsSeparatorPipe implements PipeTransform {
	transform(value: number): number {
		return 0;
	}
}
