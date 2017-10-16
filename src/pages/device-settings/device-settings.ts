import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';

@IonicPage()
@Component({
  templateUrl: 'device-settings.html'
})
export class DeviceSettingsPage {

  public device: NabtoDevice;
  public securityMessage: string;
  private firstView: boolean = true;

  constructor(public viewCtrl: ViewController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private params: NavParams,
              public navCtrl: NavController,
              private nabtoService: NabtoService
             ) {
    this.device = params.get('device');
    console.log("Editing device " + this.device.name);
  }

  ionViewDidLoad() {
    if (this.device.currentUserIsOwner) {
      this.readDeviceSecuritySettings();
    }
  }

  ionViewDidEnter() {
    if (!this.firstView) {
      this.readDeviceSecuritySettings();
    } else {
      // first time we enter the page, just show the values populated
      // during load (to not invoke device again a few milliseconds
      // after load)
      this.firstView = false;
    }
  }

  readDeviceSecuritySettings() {
    this.nabtoService.readAllSecuritySettings(this.device)
      .then(() => this.updateSecurityMessage())
      .catch((error) => {
        this.handleError("Could not read security settings: " + error.message);
      });
  }

  updateSecurityMessage() {
    if (this.device.openForPairing) {
      this.securityMessage = "This device is currently open for pairing to grant new guests access.";
    } else {
      this.securityMessage = "This device is closed for pairing, change this to grant new guests access.";
    }
  }
  
  handleError(message: string) {
    var opts = <any>{
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000
    };
    let toast = this.toastCtrl.create(opts);
    toast.present();
  }
  
  saveProperties() {
    this.nabtoService.setSystemInfo(this.device)
      .then(() => {
        let toast = this.toastCtrl.create({
          message: "Device updated!",
          showCloseButton: true,
          duration: 2500,
        });
        toast.present();
      }).catch((error) => {
        this.handleError(error.message);
      });
  }
  
  dismiss() {
    this.viewCtrl.dismiss(this.device);
  }

  showSecurityPage() {
    this.navCtrl.push('SecurityPage', {
      device: this.device
    });
  }

  home() {
    this.navCtrl.popToRoot();
  }

    
}

