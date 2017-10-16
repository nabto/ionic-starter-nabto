import { Component } from '@angular/core';
import { NabtoService } from '../../app/nabto.service';
import { ProfileService } from '../../app/profile.service';
import { ToastController, NavController, ViewController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

declare var cordova;
declare var NabtoError;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  operatingSystem: string;
  deviceName: string;
  
  constructor(private viewCtrl: ViewController,
              private profileService: ProfileService,
              public toastCtrl: ToastController,
              private nabtoService: NabtoService,
              private nav: NavController,
              private platform: Platform
             )   
  {
    platform.ready().then(() => {
      this.fixAndroidBackButton();
    });
  }

  fixAndroidBackButton() {
    return this.platform.registerBackButtonAction(() => {
      let view = this.nav.getActive();
      if (view.component.name == "ProfilePage") {
        console.log("When the profile creation page is dismissed you must have a valid profile - hence we ignore back");
      }
    });
  }
    
  ionViewDidLoad() {
    this.operatingSystem = (<any>window).device.platform;
    this.deviceName = cordova.plugins.deviceName.name;
  }

  ionViewWillEnter() {
    this.nav.swipeBackEnabled = false;
  }
  
  ionViewWillLeave() {
    this.nav.swipeBackEnabled = true;
  }

  log() {
    console.log(this.operatingSystem);
    console.log(this.deviceName);
    console.log("Invoke create keypair");
  }

  submit() {
    this.profileService.createKeyPair(this.deviceName)
      .then((name) => {
        console.log(`Key pair created successfully for ${name}`);
        this.profileService.storeKeyPairName(name);
        // restarting Nabto to close session with previous key and start new with new one
        this.nabtoService.shutdown().then(() => {
          console.log("Nabto stopped")
          this.nabtoService.startupAndOpenProfile(name)
            .then(() => {
              console.log("Nabto re-started with profile " + name);
              this.viewCtrl.dismiss(name);
            })
            .catch(() => {
              console.log("Could not start Nabto after creating new key pair, please contact support");
              this.viewCtrl.dismiss(name);
            })
        });
      })
      .catch((error) => {
        this.showError(error);
      });
  }

  showError(error: any) {
    console.log("An error occurred when creating key pair: " + JSON.stringify(error));
    let toast = this.toastCtrl.create({
      message: error.message,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  clear() {
    this.deviceName = "";
  }

}

