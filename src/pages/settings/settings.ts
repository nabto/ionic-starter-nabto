import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { BookmarksService } from '../../app/bookmarks.service';
import { ProfileService } from '../../app/profile.service';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {

  operatingSystem: string;
  dirty: boolean;

  constructor(public viewCtrl: ViewController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController
             ) {}

  ionViewDidLoad() {
    this.operatingSystem = (<any>window).device.platform;
    this.dirty = false;
  }

  dismiss() {
    this.viewCtrl.dismiss(this.dirty);
  }

  showKeyPairCreationPage() {
  }

  clearProfile() {
    this.clear(`Are you sure you want to remove the currently active keypair? All known devices must be paired again with the new keypair.`, () => {
      this.dirty = true;
      this.profileService.clear();
      this.modalCtrl.create(ProfilePage, undefined, { enableBackdropDismiss: false }).present();
    });
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
