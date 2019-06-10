import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NabtoService } from '../../app/nabto.service';
import { DeviceUser, NabtoDevice } from '../../app/device.class';

@IonicPage()
@Component({
  templateUrl: 'acl-add.html',
})
export class AclAddPage {

  device: NabtoDevice;
  fingerprint: string;
  name: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private nabtoService: NabtoService,
              private barcodeScanner: BarcodeScanner) {
    this.device = navParams.get('device');
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
    // TODO: unprettify if pretty
    var user = new DeviceUser({ "fingerprint": this.fingerprint,
                                "name": this.name });
    this.nabtoService.addUser(this.device, user)
      .then((status: number) => {
        if (status == 0) {
          this.navCtrl.pop();
        } else {
          this.showToast("Could not add user, status is " + status);
        }
      })
      .catch(error => {
        console.error(error.message);
        this.showToast("Could not add user: " + error.message);
      });
    }

  scan() {
    this.barcodeScanner.scan().then(barcodeResult => {
      console.log("Scanned QR code, got data: " + JSON.stringify(barcodeResult));
      var json = null;
      try {
        json = JSON.parse(barcodeResult.text);
        if (!json.hasOwnProperty('f')) {
          json = null;
          this.showToast("Missing fingerprint in QR code");
        } else if (!json.hasOwnProperty('n')) {
          json = null;
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
  }

  clear() {
    this.name = "";
    this.fingerprint = "";
  }
}
