import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

declare var cordova:any;

@IonicPage()
@Component({
  templateUrl: 'show-fp-qr.html',
})
export class ShowFpQrPage {

  qrInput: string = null;
  createdCode = null;
  scannedCode = null;

  fingerprint: string;
  name: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController) {
    this.fingerprint = navParams.get('fp');
    this.name = navParams.get('name');
  }

  ionViewDidEnter() {
    this.qrInput = JSON.stringify({
      "f": this.fingerprint,
      "n": this.name
    });
    console.log("Input for QR code: [" + this.qrInput + "]");
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 2000
    });
    toast.present();
  }

  copyFingerprint() {
    cordova.plugins.clipboard.copy(this.fingerprint);
    this.showToast(`Fingerprint copied to clipboard`);
  }

  home() {
    this.navCtrl.setRoot('OverviewPage');
  }

}
