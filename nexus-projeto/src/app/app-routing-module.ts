// este arquivo define as rotas principais do app
// cada rota leva para um modulo que carrega quando necessário lazy loading
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // quando a url for nexus carrega o modulo da pagina nexus
  {
    path: 'nexus',
    loadChildren: () => import('./nexus-md/nexus-md-module').then(m => m.NexusMdModule)
  },
  // quando a url for tela carrega o modulo da tela com chat
  {
    path: 'tela',
    loadChildren: () => import('./tela-mod/tela-mod-module').then(m => m.TelaModModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
