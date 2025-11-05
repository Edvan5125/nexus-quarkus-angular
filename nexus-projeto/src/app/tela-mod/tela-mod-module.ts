import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelaModRoutingModule } from './tela-mod-routing-module';
import { TelaComp } from './tela-comp/tela-comp';

@NgModule({
  imports: [
    CommonModule,
    TelaModRoutingModule,
    TelaComp
  ]
})
export class TelaModModule { }
