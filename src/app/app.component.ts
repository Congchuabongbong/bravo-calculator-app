import { Component, HostListener } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'bravo-calculator-app';
	constructor() {}

	@HostListener('window:keydown', ['$event'])
	public open(event: KeyboardEvent) {
		if (event.key == 'Escape') {
			window.open('http://localhost:4200/calculator', 'newWindow', 'width=700,height=700');
		}
	}
}
