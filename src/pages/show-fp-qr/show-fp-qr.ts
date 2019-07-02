import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ProfileService } from '../../app/profile.service';

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
              private profileService: ProfileService,
              private toastCtrl: ToastController) {
  }

  updateFingerPrint() {
    return this.profileService.getFingerprintAndName()
      .then((result) => {
        this.name = result.keyName;
        this.fingerprint = result.fingerprint;
      })
      .catch((error) => {
        console.log("Error getting name/fingerprint: " + JSON.stringify(error));
        this.showToast(error.message);
      });
  }

  ionViewDidEnter() {
    this.updateFingerPrint().then(() => {
      this.qrInput = JSON.stringify({
        "f": this.fingerprint,
        "n": this.name
      });
      console.log("Input for QR code: [" + this.qrInput + "]");
    });
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
