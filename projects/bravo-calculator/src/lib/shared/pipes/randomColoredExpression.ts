import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
	name: 'randomColorExpression',
})
export class RandomColorExpression implements PipeTransform {
	constructor(private sanitizer: DomSanitizer) {}
	transform(expression: string): SafeHtml {
		let numbers = expression.match(/-?\d+(\.\d+)?/g) || '0'; // regex để tìm tất cả số trong biểu thức
		let colors = [];
		for (let i = 0; i < numbers.length; i++) {
			let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); // tạo một mã màu hex ngẫu nhiên
			colors.push(randomColor);
			expression = expression.replace(numbers[i], `<span style="color: ${randomColor}">${numbers[i]}</span>`); // đổi các số thành span với mã màu phù hợp
		}
		return this.sanitizer.bypassSecurityTrustHtml(expression);
	}
}
