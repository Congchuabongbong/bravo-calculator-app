import { NgModule } from '@angular/core';
import { BravoCalculatorComponent } from './bravo-calculator.component';
import { DisplayScreenComponent } from './components/display-screen/display-screen.component';
import { HistoryScreenComponent } from './components/history-screen/history-screen.component';
import { NumberPadComponent } from './components/number-pad/number-pad.component';

@NgModule({
	declarations: [BravoCalculatorComponent, DisplayScreenComponent, HistoryScreenComponent, NumberPadComponent],
	imports: [],
	exports: [BravoCalculatorComponent],
})
export class BravoCalculatorModule {}
