import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { CalculatorInvoker } from './core/command/invoker.service';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { calculatorReceiver, initialStateCalculator, INITIAL_STATE_CALCULATOR, RECEIVER_TOKEN } from './init-app';

import { FormsModule } from '@angular/forms';
import { ThousandsSeparatorPipe } from './shared/pipes/thousandsSeparator.format';
import { WjCoreModule } from '@grapecity/wijmo.angular2.core';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';

import { ClickMenuSelectionDirective } from './shared/directives/clickMenuMultipleSelect.directive';
import { MenuMultipleSelectComponent } from './shared/components/menu-multiple-select/menu-multiple-select.component';

@NgModule({
	declarations: [BravoCalculatorComponent, ThousandsSeparatorPipe, ClickMenuSelectionDirective, MenuMultipleSelectComponent],
	imports: [CommonModule, FormsModule, WjCoreModule, WjInputModule],
	exports: [BravoCalculatorComponent],
	providers: [{ provide: INITIAL_STATE_CALCULATOR, useValue: initialStateCalculator }, { provide: RECEIVER_TOKEN, useValue: calculatorReceiver }, ReducerService, Store, CalculatorInvoker],
})
export class BravoCalculatorModule {}
