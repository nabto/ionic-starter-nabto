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
  public securityMesssage: string;

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
    this.readDeviceSecuritySettings();
  }

  readDeviceSecuritySettings() {
    this.nabtoService.invokeRpc(this.device, "get_security_settings.json")
      .then((state: any) => {
        this.device.currentUserIsOwner = state.current_user_is_owner;
        this.device.remoteAccessEnabled = state.remote_access_enabled;
        this.device.openForPairing = state.open_for_pairing;
        this.device.grantGuestRemoteAccess = state.default_permissions_after_pairing;
        this.updateSecurityMessage();
      })
      .catch((error) => {
        this.handleError("Could not read security settings: " + error.message);
      });
  }

  updateSecurityMessage() {
    if (this.device.currentUserIsOwner) {
      if (this.device.openForPairing) {
        this.securityMesssage = "Your device is currently open for pairing.";
      } else {
        this.securityMesssage = "Your device is closed for pairing, change this to grant guests access.";
      }
    } else {
      this.securityMesssage = "Only the owner of this device can change security settings, you currently only have guest permissions. If you actually are the owner, you must perform a factory reset of the device.";
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

