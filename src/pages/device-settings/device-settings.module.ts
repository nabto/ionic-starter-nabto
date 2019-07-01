import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeviceSettingsPage } from './device-settings';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [DeviceSettingsPage],
  imports: [IonicPageModule.forChild(DeviceSettingsPage), NgxQRCodeModule],
})
export class DeviceSettingsPageModule { }
