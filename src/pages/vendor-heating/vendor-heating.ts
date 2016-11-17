import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';

@Component({
  selector: 'page-vendor-heating',
  templateUrl: 'vendor-heating.html'
})
export class VendorHeatingPage {

  device: NabtoDevice;
  activated: boolean;
  heat: number;
  mode: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.device = navParams.get('device');
    this.heat = 22;
    this.activated = true;
    this.mode = "heat";
  }

  ionViewDidLoad() {
    console.log('Hello VendorHeatingPage Page');
  }

}
