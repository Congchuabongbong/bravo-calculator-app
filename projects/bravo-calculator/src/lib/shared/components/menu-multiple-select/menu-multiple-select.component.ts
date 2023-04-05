import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { OptionCmd, OptionsMenu, EGroupMenu } from '../../../core/data-type';

@Component({
	selector: 'menu-multiple-select',
	templateUrl: './menu-multiple-select.component.html',
	styleUrls: ['./menu-multiple-select.component.scss', '../../../bravo-calculator.component.base.scss'],
})
export class MenuMultipleSelectComponent implements OnInit, OnDestroy {
	//*Declaration here
	@Input() set options(value: OptionsMenu[]) {
		this._options = value;
	}
	get options() {
		return this._options;
	}

	private _options!: OptionsMenu[];

	@Output() selectionChange = new EventEmitter();
	@Input() optionStyles!: {};
	@Input() className!: string[];

	constructor(private _el: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

	//*Life cycle here
	ngOnDestroy(): void {
		this.selectionChange.complete();
	}

	ngOnInit(): void {
		this._renderer.addClass(this._el.nativeElement, 'menu-multiple-select');
		this._renderer.addClass(this._el.nativeElement, 'active');
	}

	public get hostElement(): HTMLElement {
		return this._el.nativeElement;
	}

	public toggle(): void {
		this._el.nativeElement.classList.toggle('active');
	}

	public toggleItem(cmd: OptionsMenu, item: OptionCmd): void {
		this._mergeSelectOptionCmd(cmd, { ...item, value: !item.value });
		this.selectionChange.emit(this.options);
	}

	private _mergeSelectOptionCmd(cmd: OptionsMenu, optionCmd: OptionCmd): void {
		let selectedOptions: OptionCmd[] = cmd.optionsCmd.filter(opt => opt.value === true);
		let defaultOpt = cmd.optionsCmd.find(opt => opt.group === EGroupMenu.Default) as OptionCmd;
		if (optionCmd.group !== EGroupMenu.Default && selectedOptions.length === 0) {
			this.updateCheckedValue(cmd, optionCmd);
		} else if (optionCmd.group === EGroupMenu.Default || selectedOptions.length === 0) {
			this.reset(cmd);
		} else {
			if (selectedOptions.length === 1) {
				if (optionCmd.value) {
					let currentOptExist = selectedOptions[0];
					if (currentOptExist.group === EGroupMenu.Default || (currentOptExist.group === optionCmd.group && currentOptExist.name !== optionCmd.name) || (currentOptExist.group !== optionCmd.group && !this._canMerge(currentOptExist, optionCmd))) {
						this.updateCheckedValue(cmd, optionCmd, currentOptExist);
					} else {
						this._canMerge(currentOptExist, optionCmd) && this.updateCheckedValue(cmd, optionCmd);
					}
				} else {
					let exitsOpt = selectedOptions.find(op => op.name === optionCmd.name);
					if (exitsOpt) {
						this.updateCheckedValue(cmd, optionCmd, defaultOpt);
					}
				}
			} else if (selectedOptions.length === 2) {
				if (optionCmd.value) {
					let optSameGroup = selectedOptions.find(opt => opt.group === optionCmd.group && opt.name !== optionCmd.name);
					if (optSameGroup) this.updateCheckedValue(cmd, optionCmd, optSameGroup);
					else {
						selectedOptions.forEach(opt => {
							!this._canMerge(opt, optionCmd) && this.updateCheckedValue(cmd, opt, optionCmd);
						});
					}
				} else {
					let exitsOpt = selectedOptions.find(op => op.name === optionCmd.name);
					if (exitsOpt) {
						this.updateCheckedValue(cmd, optionCmd);
					}
				}
			}
		}
	}

	private updateCheckedValue(cmd: OptionsMenu, optionCmd: OptionCmd, previousOpt?: OptionCmd) {
		cmd.optionsCmd.forEach(opt => {
			if (opt.name === optionCmd.name) opt.value = !opt.value;
			if (previousOpt && opt.name === previousOpt.name) opt.value = !opt.value;
		});
	}

	private reset(cmd: OptionsMenu) {
		cmd.optionsCmd.forEach(opt => {
			if (opt.group === 0) opt.value = true;
			else opt.value = false;
		});
	}

	private _canMerge(optCmdExist: OptionCmd, currentOptCmd: OptionCmd): boolean {
		if ((optCmdExist.group === 1 && currentOptCmd.group === 2) || (optCmdExist.group === 2 && currentOptCmd.group === 1)) return true;
		else if ((optCmdExist.group === 2 && currentOptCmd.group === 3) || (optCmdExist.group === 3 && currentOptCmd.group === 2)) return true;
		return false;
	}
}
