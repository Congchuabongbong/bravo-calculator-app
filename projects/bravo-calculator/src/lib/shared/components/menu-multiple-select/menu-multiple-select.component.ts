import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, OnDestroy } from '@angular/core';
import { OptionCmd, OptionsMenu } from '../../../core/data-type/type';

@Component({
	selector: 'menu-multiple-select',
	templateUrl: './menu-multiple-select.component.html',
	styleUrls: ['./menu-multiple-select.component.scss'],
})
export class MenuMultipleSelectComponent implements OnInit, OnDestroy {
	//*Declaration here
	@Input() options: OptionsMenu[] = [];
	@Output() selectionChange = new EventEmitter();
	@Input() optionStyles!: {};
	@Input() className!: string[];

	constructor(private _el: ElementRef, private _renderer: Renderer2) {}

	//*Life cycle here
	ngOnDestroy(): void {}
	ngOnInit(): void {
		this._renderer.addClass(this._el.nativeElement, 'menu-multiple-select');
		this._renderer.addClass(this._el.nativeElement, 'active');
	}

	public selectedItems: any[] = [];
	public get hostElement(): HTMLElement {
		return this._el.nativeElement;
	}

	public toggle() {
		this._el.nativeElement.classList.toggle('active');
	}

	public toggleItem(item: OptionCmd) {
		item.value = !item.value;
		// const index = this.selectedItems.indexOf(item);
		// if (index === -1) {
		// 	this.selectedItems.push(item);
		// } else {
		// 	this.selectedItems.splice(index, 1);
		// }
		this.selectionChange.emit(this.options);
	}

	public isSelected(item: any) {
		return this.selectedItems.indexOf(item) !== -1;
	}
}
