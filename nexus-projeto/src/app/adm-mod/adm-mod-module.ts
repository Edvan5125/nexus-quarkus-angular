import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmModRoutingModule } from './adm-mod-routing-module';
import { AdmComp } from './adm-comp/adm-comp';


@NgModule({
  declarations: [
    AdmComp
  ],
  imports: [
    CommonModule,
    AdmModRoutingModule
  ]
})
export class AdmModModule { }
