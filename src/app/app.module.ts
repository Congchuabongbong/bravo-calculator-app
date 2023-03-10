import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BravoCalculatorModule } from 'projects/bravo-calculator/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, BravoCalculatorModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule { }
