import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login-mod/nexus-md-module').then(m => m.NexusMdModule)
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
