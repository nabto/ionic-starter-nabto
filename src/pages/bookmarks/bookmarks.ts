import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { NabtoDevice } from '../../app/device.class';
import { BookmarksService } from '../../app/bookmarks.service';
import { AlertController } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';
import { ProfilePage } from '../profile/profile';
import { VendorHeatingPage } from '../vendor-heating/vendor-heating';
import { ModalController } from 'ionic-angular';
import { ProfileService } from '../../app/profile.service';

@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

  private deviceSrc: NabtoDevice[] = [];
  devices: Observable<NabtoDevice[]>;
  shortTitle: string;
  longTitle: string;
  empty: boolean;

  constructor(public navCtrl: NavController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.shortTitle = "Overview";
    this.longTitle = "Known devices";
    this.empty = true;
  }

  ionViewDidLoad() {
    this.devices = Observable.of(this.deviceSrc);
    this.initializeWithKeyPair();
  }

  ionViewWillEnter() {
    this.refresh();
  }
  
  refresh() {
    this.bookmarksService.readBookmarks().then((bookmarks) => {
      this.deviceSrc.splice(0, this.deviceSrc.length);
      if (bookmarks) {
        for(let i = 0; i < bookmarks.length; i++) {
          this.deviceSrc.push(bookmarks[i]);
        }
      }
      this.empty = (this.deviceSrc.length == 0);
    });
  }

  showVendorPage(event, device) {
    console.log(`item tapped: ${JSON.stringify(device)}`);
    this.navCtrl.push(VendorHeatingPage, {
      device: device
    });
  }

  addNewDevice() {
    this.navCtrl.push(DiscoverPage);
  }
  
  clear() {    
    let alert = this.alertCtrl.create({
      title: 'Confirm clear',
      message: 'Do you want to clear list of known devices?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.bookmarksService.clear();
            this.refresh();
          }
        }
    ]
    });
    alert.present();
  }

  showKeyPairCreationPage() {
    let modal = this.modalCtrl.create(ProfilePage, undefined, { enableBackdropDismiss: false });
    modal.onDidDismiss(name => {
      this.initialize(name);
    });
    modal.present();
  }

  initializeWithKeyPair() {
    this.profileService.lookupKeyPairName()
      .then((name) => {
        if (name) {
          this.initialize(name);
        } else {
          this.showKeyPairCreationPage();
        }
      }).catch((error) => {
        this.showKeyPairCreationPage();
      });
  }

  initialize(name: string) {
    console.log("TODO: once basestation support selfsigned certs, invoke nabto startup with cert " + name);
  }
   
}
