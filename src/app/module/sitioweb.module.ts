import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitiowebRoutingModule } from './sitioweb-routing.module';

import { SwInicioComponent } from '../components/sw-inicio/sw-inicio.component';

@NgModule({
  declarations: [
    SwInicioComponent
  ],
  imports: [
    CommonModule,
    SitiowebRoutingModule
  ]
})
export class SitiowebModule { }
