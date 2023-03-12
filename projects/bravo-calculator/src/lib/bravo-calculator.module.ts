import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { DisplayScreenComponent } from './components/display-screen/display-screen.component';
import { HistoryScreenComponent } from './components/history-screen/history-screen.component';
import { NumberPadComponent } from './components/number-pad/number-pad.component';
import { CalculatorInvoker } from './core/command/invoker.service';
import { ReducerService } from './core/redux/reducers.service';
import { Store } from './core/redux/store.service';
import { calculatorReceiver, initialStateCalculator } from './init-app';
import { INITIAL_STATE_CALCULATOR, RECEIVER_TOKEN } from './init-app';
@NgModule({
	declarations: [BravoCalculatorComponent, DisplayScreenComponent, HistoryScreenComponent, NumberPadComponent],
	imports: [CommonModule],
	exports: [BravoCalculatorComponent],
	providers: [{ provide: INITIAL_STATE_CALCULATOR, useValue: initialStateCalculator }, { provide: RECEIVER_TOKEN, useValue: calculatorReceiver, useClass: CalculatorInvoker }, ReducerService, Store, CalculatorInvoker],
})
export class BravoCalculatorModule {}
