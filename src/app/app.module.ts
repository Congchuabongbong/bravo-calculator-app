import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { BravoCalculatorModule } from 'bravo-calculator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BravoCalculatorModule } from 'projects/bravo-calculator/src/lib/bravo-calculator.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, BravoCalculatorModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
