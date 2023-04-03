import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { CalculatorInvoker } from './core/command/invoker.service';
import { INITIAL_STATE_CALCULATOR, RECEIVER_TOKEN, calculatorReceiver, initialStateCalculator } from './init-app';

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
	providers: [{ provide: INITIAL_STATE_CALCULATOR, useValue: initialStateCalculator }, { provide: RECEIVER_TOKEN, useValue: calculatorReceiver }, CalculatorInvoker],
})
export class BravoCalculatorModule {}
