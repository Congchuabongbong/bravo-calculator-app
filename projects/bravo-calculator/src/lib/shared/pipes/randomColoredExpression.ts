import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'randomColorExpression',
})
export class RandomColorExpression implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(expression: string): SafeHtml {
        if (!expression || expression.length === 0) {
            return '';
        }
        let numbers = expression.match(/-?\d+\.?\d*/g) || ''; // regex để tìm tất cả số trong biểu thức
        let result = '';
        let lastIdx = 0; // vị trí cuối cùng của chuỗi số hạng hiện tại

        for (let i = 0; i < numbers.length; i++) {
            const idx = expression.indexOf(numbers[i], lastIdx);
            if (idx === -1) {
                // nếu không tìm thấy số hạng trong biểu thức, bỏ qua
                continue;
            }
            if (idx > lastIdx) {
                // thêm đoạn văn bản giữa các số hạng
                result += expression.substring(lastIdx, idx);
            }

            let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16); // tạo một mã màu hex ngẫu nhiên

            result += `<span style="color: ${randomColor}">${numbers[i]}</span>`; // đổi các số thành span với mã màu phù hợp
            lastIdx = idx + numbers[i].length; // cập nhật vị trí của chuỗi số hạng cuối cùng đã được thay thế.
        }

        if (lastIdx < expression.length) {
            // thêm đoạn văn bản sau số hạng cuối cùng
            result += expression.substring(lastIdx);
        }

        return this.sanitizer.bypassSecurityTrustHtml(result);
    }
}
