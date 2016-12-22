import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { BookmarksService } from '../../app/bookmarks.service';
import { NabtoService } from '../../app/nabto.service';
import { ProfileService } from '../../app/profile.service';

@Component({
  templateUrl: 'client-settings.html'
})
export class ClientSettingsPage {

  operatingSystem: string;
  dirty: boolean;
  keyName: string;
  fingerprint: string;

  constructor(public viewCtrl: ViewController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private nabtoService: NabtoService
             ) {}

  ionViewDidLoad() {
    this.operatingSystem = (<any>window).device.platform;
    this.dirty = false;
  }

  ionViewDidEnter() {
    this.profileService.lookupKeyPairName()
      .then((name) => {
        this.keyName = name;
        return this.nabtoService.getFingerprint(name);
      })
      .then((fingerprint) => {
        this.fingerprint = fingerprint.replace(/(.{2}(?=.))/g,"$1:");
      })
      .catch((error) => {
        console.log("Error getting name/fingerprint: " + JSON.stringify(error));
        this.showToast(error.message);
      });
  }
  
  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.dirty);
  }

  clearProfile() {
    this.clear(`Are you sure you want to remove the currently active keypair? All known devices must be paired again with the new keypair.`, () => {
      this.dirty = true;
      this.profileService.clear();
      this.showProfilePage();
    });
  }

  showProfilePage() {
    let modal = this.modalCtrl.create(ProfilePage, undefined, { enableBackdropDismiss: false });
    modal.onDidDismiss((name) => {
      // restarting Nabto to close session with previous key and start new with new one
      this.nabtoService.shutdown().then(() => {
        console.log("Nabto stopped")
        this.nabtoService.startupAndOpenProfile(name)
          .then(() => console.log("Nabto re-started with profile " + name))
          .catch(() => {
            console.log("Could not start Nabto after creating new key pair, please contact support");
          });
      });
    });
    modal.present();
  }
  
  clearDevices() {
    this.clear('Do you want to clear list of known devices?', () => {
      this.dirty = true;
      this.bookmarksService.clear();
    });
  }

  clear(message: string, handler: () => void) {    
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: handler
        }
    ]
    });
    alert.present();
  }


  
}
