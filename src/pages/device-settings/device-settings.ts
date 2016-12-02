import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { SecurityPage } from '../security/security';

@Component({
  templateUrl: 'device-settings.html'
})
export class DeviceSettingsPage {

  public device: NabtoDevice;

  constructor(public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private params: NavParams,
              public navCtrl: NavController
             ) {
    this.device = params.get('device');
    console.log("Editing device " + this.device.name);
  }

  saveProperties() {
    let toast = this.toastCtrl.create({
      message: "Device updated!",
      showCloseButton: false,
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }
  
  dismiss() {
    this.viewCtrl.dismiss(this.device);
    // todo: save
  }

  showSecurityPage() {
    this.navCtrl.push(SecurityPage, {
      device: this.device
    });
  }
    
/*    let modal = this.modalCtrl.create(SecurityPage,
                                      { device: this.device },
                                      { enableBackdropDismiss: false });
    modal.onDidDismiss((device) => {
    });
    modal.present();*/

}

