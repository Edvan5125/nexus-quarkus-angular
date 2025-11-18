import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroModRoutingModule } from './cadastro-mod-routing-module';
import { CadastroComp } from './cadastro-comp/cadastro-comp';


@NgModule({
  declarations: [
    CadastroComp
  ],
  imports: [
    CommonModule,
    CadastroModRoutingModule
  ]
})
export class CadastroModModule { }
