import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoService } from '../../app/nabto.service';
import { DeviceUser, NabtoDevice } from '../../app/device.class';

@Component({
  selector: 'page-acl-edit',
  templateUrl: 'acl-edit.html'
})
export class AclEditPage {

  private user: DeviceUser;
  private device: NabtoDevice;
  private hasUnhandledTap: boolean = false;
  private hasRemoteAccess;

  constructor(private navParams: NavParams,
              private nabtoService: NabtoService,
              private toastCtrl: ToastController,
              private navCtrl: NavController) {
    this.user = navParams.get('user');
    this.hasRemoteAccess = this.user.hasRemoteAccess();
    this.device = navParams.get('device');
    console.log(`Editing acl entry ${JSON.stringify(this.user)} for device ${JSON.stringify(this.device)}`);
  }

  ionViewDidEnter() {
    this.hasUnhandledTap = false;
  }
  
  tapped() {
    // we get (ionChange) events when loading page and after updating
    // model with actual device values, we don't want to invoke the
    // device in these situations (and updating from (tap) event is not reliable)
    this.hasUnhandledTap = true;
  }

  updatePermissions() {
    if (!this.hasUnhandledTap) {
      // only invoke device if a user tapped the user interface
      return;
    }
    this.hasUnhandledTap = false;
    this.user.setRemoteAccessPermission(this.hasRemoteAccess);
    this.nabtoService.setUserPermissions(this.device, this.user)    
      .then((user: DeviceUser) => {
        this.user = user;
      })
      .catch(error => {
        console.error(error.message);
        this.handleError("Could not update user: " + error.message);
      });
  }

  updateName() {
    console.log("Updating name " + this.user.name);
    this.nabtoService.setUserName(this.device, this.user)    
      .then((user: DeviceUser) => {
        this.user = user;
        console.log("Updated user: " + JSON.stringify(this.user));
      })
      .catch(error => {
        console.error(error.message);
        this.handleError("Could not update user: " + error.message);
      });
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

  
}
