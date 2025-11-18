import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComp } from './cadastro-comp/cadastro-comp';

const routes: Routes = [
  { path: '', component: CadastroComp }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastroModRoutingModule { }
