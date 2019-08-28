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
  fingerprint: string = "";
  name: string = "";

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

  parseFingerprint(fp: string) {
    // workaround for NABTO-1941 (cordova plugin includes terminating null in fp string passed on to js on iOS)
    fp = fp.replace(/\0/g, "");

    if (fp.length != 32 && fp.length != 32 + 15) {
      throw new Error(`Invalid length (${fp.length}), fingerprint must be 16 8-bit hex values, optionally separated with ':'`);
    }
    if (fp.length == 32+15) {
      fp = fp.replace(/:/g, "");
      if (fp.length != 32) {
        throw new Error('Invalid separator, fingerprint must be 16 8-bit hex values, optionally separated with \':\'');
      }
    }
    if (!fp.match(/^[a-zA-Z0-9]+$/)) {
      throw new Error(`Only hex values allowed in fingerprint (${fp})`);
    }
    return fp;
  }

  add() {
    var fp;
    try {
      fp = this.parseFingerprint(this.fingerprint);
    } catch (e) {
      console.log(`Bad fingerprint: [${this.fingerprint}]: ` + e.message);
      this.showToast("Fingerprint not valid: " + e.message);
      return;
    }
    var user = new DeviceUser({ "fingerprint": fp,
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
      if (barcodeResult.cancelled) {
        this.showToast("Cancelled QR scan");
        return;
      }
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
    }).catch((error) => this.showToast(error));
  }

  clear() {
    this.name = "";
    this.fingerprint = "";
  }
}
