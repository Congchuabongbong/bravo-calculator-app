import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { CalculatorInvoker } from './core/command/invoker.service';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { calculatorReceiver, initialStateCalculator, INITIAL_STATE_CALCULATOR, RECEIVER_TOKEN } from './init-app';
import { DisplayScreenComponent } from './shared/components/display-screen/display-screen.component';
import { HistoryScreenComponent } from './shared/components/history-screen/history-screen.component';
import { NumberPadComponent } from './shared/components/number-pad/number-pad.component';
import { FormsModule } from '@angular/forms'; // import FormsModule hoặc ReactiveFormsModule
import { ThousandsSeparatorPipe } from './shared/pipes/thousandsSeparator.format';

@NgModule({
	declarations: [BravoCalculatorComponent, DisplayScreenComponent, HistoryScreenComponent, NumberPadComponent, ThousandsSeparatorPipe],
	imports: [CommonModule, FormsModule],
	exports: [BravoCalculatorComponent],
	providers: [{ provide: INITIAL_STATE_CALCULATOR, useValue: initialStateCalculator }, { provide: RECEIVER_TOKEN, useValue: calculatorReceiver }, ReducerService, Store, CalculatorInvoker],
})
export class BravoCalculatorModule {}
