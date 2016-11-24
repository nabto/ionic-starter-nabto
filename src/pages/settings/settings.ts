import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { BookmarksService } from '../../app/bookmarks.service';
import { ProfileService } from '../../app/profile.service';

@Component({
  templateUrl: 'settings.html'
})
export class SettingsPage {

  operatingSystem: string;
  dirty: boolean;

  constructor(public viewCtrl: ViewController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private alertCtrl: AlertController
             ) {}

  ionViewDidLoad() {
    this.operatingSystem = (<any>window).device.platform;
    this.dirty = false;
  }

  dismiss() {
    this.viewCtrl.dismiss(this.dirty);
  }

  clearProfile() {
    this.clear(`Do you want to remove the keypair associated with this ${this.operatingSystem} device?`, () => {
      this.dirty = true;
      this.profileService.clear();
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
