import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculatorComponent } from './calculator/calculator.component';
import { NumberPadComponent } from './components/number-pad/number-pad.component';
import { HistoryScreenComponent } from './components/history-screen/history-screen.component';
import { DisplayScreenComponent } from './components/display-screen/display-screen.component';
@NgModule({
	declarations: [CalculatorComponent, NumberPadComponent, HistoryScreenComponent, DisplayScreenComponent],
	imports: [CommonModule],
	exports: [CalculatorComponent, NumberPadComponent, HistoryScreenComponent, DisplayScreenComponent],
})
export class CalculatorModule {}
