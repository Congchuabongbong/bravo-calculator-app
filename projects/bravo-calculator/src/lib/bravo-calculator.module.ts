import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { CalculatorInvoker } from './core/command/invoker.service';
import { FormsModule } from '@angular/forms';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';
import { ClickMenuSelectionDirective } from './shared/directives/clickMenuMultipleSelect.directive';
import { RandomColorExpression } from './shared/pipes/randomColoredExpression';
@NgModule({
	declarations: [BravoCalculatorComponent, ClickMenuSelectionDirective, MenuMultipleSelectComponent, RandomColorExpression],
	imports: [CommonModule, FormsModule, WjCoreModule, WjInputModule],
	exports: [BravoCalculatorComponent],
	providers: [CalculatorInvoker],
})
export class BravoCalculatorModule {}
