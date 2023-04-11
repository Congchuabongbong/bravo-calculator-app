import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { CalculatorInvoker } from './core/Command/invoker.service';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';
import { ClickMenuSelectionDirective } from './shared/directives/clickMenuMultipleSelect.directive';
import { RandomColorExpression } from './shared/pipes/randomColoredExpression';
const calculatorRoutes: Routes = [
    { path: '', component: BravoCalculatorComponent }
];
@NgModule({
	declarations: [BravoCalculatorComponent, ClickMenuSelectionDirective, MenuMultipleSelectComponent, RandomColorExpression],
	imports: [CommonModule, FormsModule, WjCoreModule, WjInputModule,RouterModule.forChild(calculatorRoutes)],
	exports: [BravoCalculatorComponent],
	providers: [CalculatorInvoker,RouterModule],
})
export class BravoCalculatorModule {}
