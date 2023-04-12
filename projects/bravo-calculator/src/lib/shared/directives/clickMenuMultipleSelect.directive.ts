import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { MenuMultipleSelectComponent } from '../components/menu-multiple-select/menu-multiple-select.component';

@Directive({ selector: '[clickMenu]' })
export class ClickMenuSelectionDirective implements OnInit, AfterViewInit {
	@Output() leftClickMenu = new EventEmitter();
	@Input() menuOption!: MenuMultipleSelectComponent;
	@Input() calculatorContainer!: HTMLDivElement;
	private _menuHeightDefault!: number;
	private _debounceTimeout: any;

	constructor(private el: ElementRef, private renderer: Renderer2) {}
	ngOnInit(): void {}
	ngAfterViewInit(): void {
		this.menuOption.hostElement.style.position = 'absolute';
		this._menuHeightDefault = 310;
	}

	@HostListener('document:click', ['$event'])
	onClick(event: any) {
		if (this.el.nativeElement.contains(event.target)) {
			this.menuOption.toggle();
			this._setPosition();
			return;
		}
		if (!this.menuOption.hostElement.contains(event.target) && !this.menuOption.hostElement.classList.contains('active')) {
			this.menuOption.hostElement.classList.add('active');
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		event.preventDefault();
		this._clearTimeout();
		this._debounceTimeout = setTimeout(() => {
			this._setPosition();
			window.resizeTo(385, 360);
		}, 200);
	}

	private _setPosition() {
		if (this.menuOption.hostElement.classList.contains('active')) return;
		const boundingBtnMenu = this.el.nativeElement.getBoundingClientRect();
		let paddingLeftBtnMenu = this.el.nativeElement.style.paddingLeft.replace('px', '');
		if (window.innerHeight - (boundingBtnMenu.bottom + +this._menuHeightDefault) > 0) {
			this.menuOption.hostElement.style.top = boundingBtnMenu.bottom + 'px';
			this.menuOption.hostElement.style.left = +boundingBtnMenu.left + paddingLeftBtnMenu + 'px';
			if (this.menuOption.hostElement.classList.contains('scroll-active')) this.menuOption.hostElement.classList.remove('scroll-active');
			this.menuOption.hostElement.style.height = this._menuHeightDefault + 'px';
		} else {
			this.menuOption.hostElement.style.top = this.calculatorContainer.getBoundingClientRect().top + 'px';
			this.menuOption.hostElement.style.height = this.calculatorContainer.getBoundingClientRect().height + 'px';
			this.menuOption.hostElement.style.left = +boundingBtnMenu.right + +this.el.nativeElement.style.paddingRight.replace('px', '') + 'px';
			this.menuOption.hostElement.classList.add('scroll-active');
		}
	}

	private _clearTimeout() {
		if (this._debounceTimeout) {
			clearTimeout(this._debounceTimeout);
		}
	}
}
