import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';

declare var nabto;

@Component({
  templateUrl: 'pairing.html'
})
export class PairingPage {
  device_id: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController) {
    this.device_id = navParams.get('device_id');
  }

}
