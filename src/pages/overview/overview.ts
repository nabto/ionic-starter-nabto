import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ModalController } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';
import { ProfilePage } from '../profile/profile';
import { AlertController } from 'ionic-angular';
import { VendorHeatingPage } from '../vendor-heating/vendor-heating';
import { HelpPage } from '../help/help';
import { ClientSettingsPage } from '../client-settings/client-settings';
import { NabtoDevice } from '../../app/device.class';
import { ProfileService } from '../../app/profile.service';
import { BookmarksService } from '../../app/bookmarks.service';
import { NabtoService } from '../../app/nabto.service';

@Component({
  templateUrl: 'overview.html'
})
export class OverviewPage {

  private deviceSrc: NabtoDevice[] = [];
  devices: Observable<NabtoDevice[]>;
  shortTitle: string;
  longTitle: string;
  empty: boolean;
  firstView: boolean = true;
  
  constructor(public navCtrl: NavController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private nabtoService: NabtoService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.shortTitle = "Overview";
    this.longTitle = "Known devices";
    this.empty = true;
  }

  ionViewDidLoad() {
    this.devices = Observable.of(this.deviceSrc);
    this.initializeWithKeyPair();
    this.refresh();
  }

  ionViewDidEnter() {
    if (!this.firstView) {
      this.refresh();
    } else {
      // first time we enter the page, just show the values populated
      // during load (to not invoke device again a few milliseconds
      // after load)
      this.firstView = false;
    }
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
  
  showHelpPage() {
    let modal = this.modalCtrl.create(HelpPage, undefined, { enableBackdropDismiss: false });
    modal.present();
  }

  showSettingsPage() {
    let modal = this.modalCtrl.create(ClientSettingsPage, undefined, { enableBackdropDismiss: false });
    modal.onDidDismiss((dirty) => {
      if (dirty) {
        this.refresh();
      }
    });
    modal.present();
  }

  showKeyPairCreationPage() {
    let modal = this.modalCtrl.create(ProfilePage, undefined, { enableBackdropDismiss: false });
    modal.onDidDismiss((name) => {
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
          this.nabtoService.startup().then(() => this.showKeyPairCreationPage());
        }
      }).catch((error) => {
        this.showKeyPairCreationPage();
      });
  }
  
  initialize(name: string) {
    this.nabtoService.startupAndOpenProfile(name)
      .then(() => console.log("Nabto startup completed"))
      .catch((error) => {
        if (error.message === 'BAD_PROFILE') {
          this.showKeyPairCreationPage();
        } else {
          this.showAlert("App could not start, please contact vendor: " + error.message);
        }
      });
  }

  showAlert(message: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: message,
      enableBackdropDismiss: false,
      buttons: [{ text: 'Ok' }]
    });
    alert.present();
  }

}
