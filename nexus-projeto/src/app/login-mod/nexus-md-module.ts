import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NexusComponent } from './nexus-component/nexus-component';
import { NexusRoutingModule } from './nexus-md-routing-module';

@NgModule({
  imports: [
    CommonModule,
    NexusRoutingModule,
    NexusComponent
  ]
})
export class NexusMdModule {}


