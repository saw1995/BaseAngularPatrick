import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SwInicioComponent } from '../components/sw-inicio/sw-inicio.component';

const routes: Routes = [
  { path: 'web', component: SwInicioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitiowebRoutingModule { }
