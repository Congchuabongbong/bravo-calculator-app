import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BravoCalculatorModule } from 'projects/bravo-calculator/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorModule } from './bravo-calculator-app/calculator.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, CalculatorModule, BravoCalculatorModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
