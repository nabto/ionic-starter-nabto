import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';

@Component({
  templateUrl: 'device-settings.html'
})
export class DeviceSettingsPage {

  device: NabtoDevice;

  constructor(public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private params: NavParams
             ) {
    this.device = params.get('device');
    console.log("Editing device " + this.device.name);
  }
  
  save() {
    this.viewCtrl.dismiss({dirty: true, device: this.device});
  }

  clear() {
    this.device.name = "";
  }
  
  dismiss() {
    this.viewCtrl.dismiss({dirty: false});
  }

  

}

