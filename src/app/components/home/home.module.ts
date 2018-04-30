import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../../module/angular_material.module';

@NgModule({
  imports: [
  CommonModule,
    HomeRoutingModule,
    MaterialModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }