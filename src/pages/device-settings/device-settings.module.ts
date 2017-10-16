import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceSettingsPage } from './device-settings';
@NgModule({
  declarations: [DeviceSettingsPage],
  imports: [IonicPageModule.forChild(DeviceSettingsPage)],
})
export class DeviceSettingsPageModule { }
