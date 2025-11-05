import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComp } from './config-comp/config-comp';

const routes: Routes = [
  { path: '', component: ConfigComp }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigguracaoModRoutingModule { }
