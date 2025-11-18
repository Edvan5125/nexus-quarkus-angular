import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmComp } from './adm-comp/adm-comp';



const routes: Routes = [
  { path: '', component: AdmComp, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmModRoutingModule { }
