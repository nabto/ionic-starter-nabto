import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ModalController } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';
import { ProfilePage } from '../profile/profile';
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

  constructor(public navCtrl: NavController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private nabtoService: NabtoService,
              private modalCtrl: ModalController) {
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
          this.showKeyPairCreationPage();
        }
      }).catch((error) => {
        this.showKeyPairCreationPage();
      });
  }
  
  initialize(name: string) {
    this.nabtoService.startup(name)
      .then(() => console.log("Nabto startup completed"))
      .catch((error) => console.log("Nabto startup failed: " + error));
  }

}
