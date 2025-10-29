import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'nexus',
    loadChildren: () => import('./nexus-md/nexus-md-module').then(m => m.NexusMdModule)
  },
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
