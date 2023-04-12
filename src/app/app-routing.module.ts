import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: 'calculator', loadChildren: () => import('projects/bravo-calculator/src/lib/bravo-calculator.module').then(m => m.BravoCalculatorModule) }];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
