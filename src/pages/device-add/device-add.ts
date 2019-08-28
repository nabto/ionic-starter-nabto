import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NabtoService } from '../../app/nabto.service';
import { DeviceUser, NabtoDevice } from '../../app/device.class';

declare var NabtoError;

@IonicPage()
@Component({
  templateUrl: 'device-add.html',
})
export class DeviceAddPage {

  deviceId: string = "";
  busy: boolean;

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
      duration: 5000
    });
    toast.present();
  }

  showError(error: any) {
    this.busy = false;
    if (error.message) {
      this.showToast("An error occurred when accessing device: " + error.message);
    } else {
      this.showToast("An error occurred when accessing device");
    }
  }

  add() {
    this.busy = true;
    this.nabtoService.prepareInvoke([this.deviceId]).then(() => {
      this.nabtoService.getPublicDetails(this.deviceId).then((device: NabtoDevice) => {
        this.busy = false;
        this.viewCtrl.dismiss(device);
      }).catch((error) => {
        if (error && error.code && (error.code == NabtoError.Code.P2P_ACCESS_DENIED_CONNECT ||
                                    error.code == NabtoError.Code.EXC_NO_ACCESS)) {
          this.busy = false;
          this.showToast("Access denied - the device owner must add your public key fingerprint to the device access control list. Use the share button on this page to share your fingerprint with owner.");
        } else {
          this.showError(error);
        }
      });
    }).catch((error) => {
      this.showError(error);
    });
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
    }).catch((error) => this.showToast(error));
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
