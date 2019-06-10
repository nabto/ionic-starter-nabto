import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
  templateUrl: 'acl-add.html',
})
export class AclAddPage {

  qrInput: string = null;
  createdCode = null;
  scannedCode = null;

  fingerprint: string;
  name: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private barcodeScanner: BarcodeScanner) {
  }

  ionViewDidEnter() {
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 2000
    });
    toast.present();
  }

  home() {
    this.navCtrl.setRoot('OverviewPage');
  }

  add() {
    this.showToast("TODO - add name=${this.name}, fp=${this.fingerprint}");
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeResult => {
      console.log("Scanned QR code, got data: " + JSON.stringify(barcodeResult));
      var json = null;
      try {
        json = JSON.parse(barcodeResult.text);
        if (!json.hasOwnProperty('f')) {
          this.showToast("Missing fingerprint in QR code");
        }
        if (!json.hasOwnProperty('n')) {
          this.showToast("Missing device name in QR code");
        }
      } catch (e) {
        this.showToast("Invalid data in QR code");
      }
      if (json != null) {
        this.name = json.n;
        this.fingerprint = json.f;
      }
    });
    /*
    var cb = (name, fingerprint) => {
      return new Promise((resolve, reject) => {
        this.name = name;
        this.fingerprint = fingerprint;
        resolve();
      });
    }
    this.navCtrl.push('ScanQrPage', {
      cb: cb
    });*/
  }

  clear() {
    this.name = "";
    this.fingerprint = "";
  }
}
