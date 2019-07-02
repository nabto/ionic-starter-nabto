import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NabtoService } from '../../app/nabto.service';
import { DeviceUser, NabtoDevice } from '../../app/device.class';

@IonicPage()
@Component({
  templateUrl: 'device-add.html',
})
export class DeviceAddPage {

  deviceId: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private nabtoService: NabtoService,
              private viewCtrl: ViewController,
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

  add() {
    this.viewCtrl.dismiss(this.deviceId);
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeResult => {
      if (barcodeResult.cancelled) {
        this.showToast("Cancelled QR scan");
        return;
      }
      console.log("Scanned QR code, got data: " + JSON.stringify(barcodeResult));
      var json = null;
      try {
        json = JSON.parse(barcodeResult.text);
        if (!json.hasOwnProperty('i')) {
          json = null;
          this.showToast("Missing device id in QR code");
        }
      } catch (e) {
        this.showToast("Invalid data in QR code");
      }
      if (json != null) {
        this.deviceId = json.i;
      }
    });
  }

  clear() {
    this.deviceId = "";
  }

  shareFingerprint() {
    this.navCtrl.push('ShowFpQrPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
