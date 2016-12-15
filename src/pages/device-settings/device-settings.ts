import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { SecurityPage } from '../security/security';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';

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
    this.nabtoService.readDeviceSecuritySettings(this.device)
      .then(() => this.updateSecurityMessage())
      .catch((error) => {
        this.handleError("Could not read security settings: " + error.message);
      });
  }

  updateSecurityMessage() {
    // XXX: include more info in summary?
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
      closeButtonText: 'Ok'
    };
    let toast = this.toastCtrl.create(opts);
    toast.present();
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
//    TODO check permission - show alert if not admin!
    this.navCtrl.push(SecurityPage, {
      device: this.device
    });
  }
    
}

