import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login-mod/nexus-md-module').then(m => m.NexusMdModule)
  },
  {
    path: 'adm',
    loadChildren: () => import('./adm-mod/adm-mod-module').then(m => m.AdmModModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro-mod/cadastro-mod-module').then(m => m.CadastroModModule)
  },
  {
    path: 'tela',
    loadChildren: () => import('./tela-mod/tela-mod-module').then(m => m.TelaModModule)
  },
  {
    path: 'configuracao',
    loadChildren: () => import('./configguracao-mod/configguracao-mod-module').then(m => m.ConfigguracaoModModule)
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
