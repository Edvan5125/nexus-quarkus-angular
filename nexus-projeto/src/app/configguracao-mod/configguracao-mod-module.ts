import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigguracaoModRoutingModule } from './configguracao-mod-routing-module';
import { FormsModule } from '@angular/forms';
import { ConfigComp } from './config-comp/config-comp';


@NgModule({
  declarations: [
    ConfigComp
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConfigguracaoModRoutingModule
  ]
})
export class ConfigguracaoModModule { }
