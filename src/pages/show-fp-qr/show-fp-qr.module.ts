import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowFpQrPage } from './show-fp-qr';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [ShowFpQrPage],
  imports: [IonicPageModule.forChild(ShowFpQrPage), NgxQRCodeModule],
})
export class ShowFpQrPageModule { }
