import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';

class AclEntry {
  name: string;
  role: string;
  fingerprint: string;
};

@Component({
  templateUrl: 'security.html'
})
export class SecurityPage {

  public device: NabtoDevice;
  public acl: Observable<AclEntry[]>;
  private aclSrc = [];

  constructor(private params: NavParams,
              private alertCtrl: AlertController) {
    this.device = params.get('device');
    this.device.addLocalUsers = false;
    this.device.allowLocalAccess = false;
  }

  ionViewDidLoad() {
  }

  allowLocalAccessToggled() {
    console.log("allowLocalAccess is now " + this.device.allowLocalAccess);
  }

  addLocalUsersToggled() {
    console.log("this.device.addLocalUsers=" + this.device.addLocalUsers);
    if (this.device.addLocalUsers) {
      this.showAlert("Are you sure you want to allow local guests to later access your device remotely? You can always change your mind and edit the access control list to remove unwanted guests.",
                     () => { this.device.addLocalUsers = true; return true },
                     () => { this.device.addLocalUsers = false; return true }
                    );
    }
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
