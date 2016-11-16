import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';

@Component({
  selector: 'page-vendor-heating',
  templateUrl: 'vendor-heating.html'
})
export class VendorHeatingPage {

  device: NabtoDevice;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.device = navParams.get('device');
  }

  ionViewDidLoad() {
    console.log('Hello VendorHeatingPage Page');
  }

}
