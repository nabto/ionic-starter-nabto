import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoService } from '../../app/nabto.service';
import { DeviceUser, NabtoDevice } from '../../app/device.class';

@IonicPage()
@Component({
  templateUrl: 'security.html'
})
export class SecurityPage {

  addLocalUsers: boolean;
  hasUnhandledTap: boolean;

  public device: NabtoDevice;
  public acl: Observable<DeviceUser[]>;
  private aclSrc = [];

  constructor(private params: NavParams,
              private navCtrl: NavController,
              private nabtoService: NabtoService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController) {
    this.device = params.get('device');
    this.hasUnhandledTap = false;
  }

  ionViewDidLoad() {
    this.acl = Observable.of(this.aclSrc);
    console.log("Security settings for device " + JSON.stringify(this.device));
  }

  ionViewDidEnter() {
    this.readAcl();
    this.hasUnhandledTap = false;
  }

  readAcl() {
    this.nabtoService.invokeRpc(this.device.id, "get_users.json", { "count": 10, "start": 0 }).
      then((acl: any) => {
        console.log("Got users: " + JSON.stringify(acl));
        this.aclSrc.splice(0, this.aclSrc.length);
        for(let i = 0; i < acl.users.length; i++) {
          this.aclSrc.push(new DeviceUser(acl.users[i]));
        }
      }).catch(error => {
        this.handleError(error.message);
      });
  }

  tapped() {
    // we get (ionChange) events when loading page and after updating
    // model with actual device values, we don't want to invoke the
    // device in these situations (and updating from (tap) event is not reliable)
    this.hasUnhandledTap = true;
  }

  aclEntryTapped(event, user) {
    this.navCtrl.push('AclEditPage', {
      user: user,
      device: this.device
    });
  }

  update() {
    if (!this.hasUnhandledTap) {
      // only invoke device if a user tapped the user interface
      return;
    }
    console.log("Updating settings: " + JSON.stringify(this.device));
    this.nabtoService.setSystemSecuritySettings(this.device)
      .then(() => console.log("Updated settings: " + JSON.stringify(this.device)))
      .catch(error => {
        console.log(error.message);
        this.handleError("Could not update settings: " + error.message);
      });
    this.hasUnhandledTap = false;
  }

  handleError(message: string) {
    var opts = <any>{
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 2500
    };
    let toast = this.toastCtrl.create(opts);
    toast.present();
  }

  showAlert(message: string, yesHandler: () => void, noHandler: () => void) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          handler: noHandler
        },
        {
          text: 'Yes',
          handler: yesHandler
        }
      ]
    });
    alert.present();
  }

  home() {
    this.navCtrl.popToRoot();
  }

  addToAcl() {
    this.navCtrl.push('AclAddPage', { "device": this.device });
  }

}
