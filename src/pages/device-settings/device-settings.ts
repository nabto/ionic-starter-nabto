import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';

@Component({
  templateUrl: 'device-settings.html'
})
export class DeviceSettingsPage {

  device: NabtoDevice;

  constructor(public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private params: NavParams
             ) {
    this.device = params.get('device');
    console.log("Editing device " + this.device.name);
  }

  saveProperties() {
    let toast = this.toastCtrl.create({
      message: "Device updated!",
      showCloseButton: false,
      duration: 1500
    });
    toast.present();
  }
  
  dismiss() {
    this.viewCtrl.dismiss(this.device);
    // todo: save
  }
  

}

