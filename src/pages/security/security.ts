import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoService } from '../../app/nabto.service';
import { NabtoDevice } from '../../app/device.class';

class AclEntry {
  name: string;
  fingerprint: string;
  role: string;
  icon: string;
  constructor (name: string, fingerprint: string, role: string) {
    this.name = name;
    this.fingerprint = fingerprint;
    this.role = role;
    this.icon = (role == "Guest" ? "people" : "contact");
    console.log("icon: " + this.icon);
  }
};

@Component({
  templateUrl: 'security.html'
})
export class SecurityPage {

  addLocalUsers: boolean;
  
  public device: NabtoDevice;
  public acl: Observable<AclEntry[]>;
  private aclSrc = [];
  private toggleTapped = false;

  constructor(private params: NavParams,
              private nabtoService: NabtoService,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController) {
    this.device = params.get('device');
  }

  ionViewDidLoad() {
    this.acl = Observable.of(this.aclSrc);
    this.readAcl();
    this.toggleTapped = false;
    console.log("Security settings for device " + JSON.stringify(this.device));
  }

  readAcl() {
    this.nabtoService.invokeRpc(this.device, "get_users.json").
      then((acl: any) => {
        console.log("Got users: " + JSON.stringify(acl));
        this.aclSrc.splice(0, this.aclSrc.length);
        for(let i = 0; i < acl.users.length; i++) {
          this.aclSrc.push(new AclEntry(acl.users[i].name,
                                        acl.users[i].fingerprint,
                                        acl.users[i].is_owner ? "Owner" : "Guest"));
        }
      }).catch(error => {
//        this.handleError(error);
      });
  }

  addLocalUsersTapped() {
    // if only handling ionChange events, the alert will also be shown
    // when navigating to the form if the toggle is on (odd
    // behavior...) - so make sure to only show alert if toggle has
    // actually been tapped.
    this.toggleTapped = true;
  }

  addLocalUsersToggled() {
    if (!this.toggleTapped) {
      return;
    }
    this.toggleTapped = false;
    console.log("this.device.addLocalUsers=" + this.addLocalUsers);
    if (this.addLocalUsers) {
      this.showAlert("Are you sure you want to allow local guests to later access your device remotely? You can always change your mind and edit the access control list to remove unwanted guests.",
                     () => { this.addLocalUsers = true; return true },
                     () => { this.addLocalUsers = false; return true }
                    );
    }
  }

  update() {
    this.nabtoService.invokeRpc(this.device, "set_security_settings.json",
                                { "remote_access_enabled": this.device.remoteAccessEnabled ? 1 : 0,
                                  "open_for_pairing": this.device.openForPairing ? 1 : 0,
                                  "default_permissions_after_pairing": this.device.grantGuestRemoteAccess ? 1 : 0 }).
      then((state: any) => {
        this.device.remoteAccessEnabled = state.remote_access_enabled;
        this.device.openForPairing = state.open_for_pairing;
        this.device.grantGuestRemoteAccess = state.default_permissions_after_pairing;
      }).catch(error => {
        this.handleError("Could not update settings: " + error.message);
      });
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
}
