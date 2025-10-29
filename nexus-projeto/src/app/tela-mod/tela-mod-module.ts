import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelaModRoutingModule } from './tela-mod-routing-module';
import { TelaComp } from './tela-comp/tela-comp';

@NgModule({
  // TelaComp é standalone — deve ser IMPORTADO, não declarado
  imports: [
    CommonModule,
    TelaModRoutingModule,
    TelaComp
  ]
})
export class TelaModModule { }
