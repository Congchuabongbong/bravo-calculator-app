import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { PopupPosition } from '@grapecity/wijmo';
import { MenuMultipleSelectComponent } from '../components/menu-multiple-select/menu-multiple-select.component';

@Directive({ selector: '[clickMenu]' })
export class ClickMenuSelectionDirective implements OnInit {
	@Output() leftClickMenu = new EventEmitter();
	@Input() menuOption!: MenuMultipleSelectComponent;
	@Input() position: PopupPosition = PopupPosition.BelowLeft;
	private _debounceTimeout: any;

	constructor(private el: ElementRef, private renderer: Renderer2) {}
	ngOnInit(): void {
		this._setPosition();
	}

	@HostListener('document:click', ['$event'])
	onClick(event: any) {
		if (this.el.nativeElement.contains(event.target)) {
			this.menuOption.toggle();
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
		}, 300);
	}

	private _setPosition() {
		this.menuOption.hostElement.style.position = 'absolute';
		switch (this.position) {
			case PopupPosition.BelowLeft:
				this.menuOption.hostElement.style.top = this.el.nativeElement.getBoundingClientRect().bottom + 'px';
				this.menuOption.hostElement.style.left = +this.el.nativeElement.getBoundingClientRect().left + +this.el.nativeElement.style.paddingLeft.replace('px', '') + 'px';
				break;
			default:
				break;
		}
	}

	private _clearTimeout() {
		if (this._debounceTimeout) {
			clearTimeout(this._debounceTimeout);
		}
	}
}
