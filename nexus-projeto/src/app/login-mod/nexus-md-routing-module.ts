import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NexusComponent } from './nexus-component/nexus-component';

const routes: Routes = [
  {
    path: '', component: NexusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NexusRoutingModule {}
