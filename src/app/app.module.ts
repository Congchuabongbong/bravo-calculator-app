import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './bravo-calculator-app/calculator/calculator.component';
import { NumberPadComponent } from './bravo-calculator-app/components/number-pad/number-pad.component';
import { HistoryScreenComponent } from './bravo-calculator-app/components/history-screen/history-screen.component';
import { DisplayScreenComponent } from './bravo-calculator-app/components/display-screen/display-screen.component';

@NgModule({
	declarations: [AppComponent, CalculatorComponent, NumberPadComponent, HistoryScreenComponent, DisplayScreenComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
