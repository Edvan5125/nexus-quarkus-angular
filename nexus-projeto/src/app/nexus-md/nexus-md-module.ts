import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NexusMdRoutingModule } from './nexus-md-routing-module';
import { NexusComponent } from './nexus-component/nexus-component';


@NgModule({
  declarations: [
    NexusComponent
  ],
  imports: [
    CommonModule,
    NexusMdRoutingModule
  ]
})
export class NexusMdModule { }
