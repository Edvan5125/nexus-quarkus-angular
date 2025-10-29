import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaComp } from './tela-comp/tela-comp';

const routes: Routes = [
  {
    path: '', component: TelaComp
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelaModRoutingModule { }
