import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceAddPage } from './device-add';

@NgModule({
  declarations: [DeviceAddPage],
  imports: [IonicPageModule.forChild(DeviceAddPage)],
})
export class DeviceAddPageModule { }
