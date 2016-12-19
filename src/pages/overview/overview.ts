import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { ModalController } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';
import { ProfilePage } from '../profile/profile';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { VendorHeatingPage } from '../vendor-heating/vendor-heating';
import { HelpPage } from '../help/help';
import { ClientSettingsPage } from '../client-settings/client-settings';
import { NabtoDevice } from '../../app/device.class';
import { ProfileService } from '../../app/profile.service';
import { Bookmark, BookmarksService } from '../../app/bookmarks.service';
import { NabtoService } from '../../app/nabto.service';
import { Platform } from 'ionic-angular';

@Component({
  templateUrl: 'overview.html'
})
export class OverviewPage {

  devices: Observable<NabtoDevice[]>;
  shortTitle: string;
  longTitle: string;
  empty: boolean;
  firstView: boolean = true;
  
  constructor(public navCtrl: NavController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private nabtoService: NabtoService,
	      private platform: Platform,
              private modalCtrl: ModalController,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController) {
    this.shortTitle = "Overview";
    this.longTitle = "Known devices";
    this.empty = true;
  }

  ionViewDidLoad() {
    this.initialize();
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

  initialize() {
    this.profileService.lookupKeyPairName()
      .then((name) => {
        if (name) {
          console.log(`Initializing using profile [${name}]`);
          this.initializeWithKeyPair(name);
        } else {
          console.log('No profile found, creating');
          this.nabtoService.startup()
            .then(() => this.showKeyPairCreationPage())
            .catch((err) => console.log(`An error occurred: ${err}`));
        }
      }).catch((err) => {
        console.log(`An error occurred: ${err}`);
        this.showKeyPairCreationPage();
      });
  }
  
  initializeWithKeyPair(name: string) {
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

  showKeyPairCreationPage() {
    let modal = this.modalCtrl.create(ProfilePage, undefined, { enableBackdropDismiss: false });
    modal.onDidDismiss((name) => {
      this.initializeWithKeyPair(name);
    });
    modal.present();
  }

  refresh() {
//    var devIds : string[] = [];
    this.bookmarksService.readBookmarks().then((bookmarks: Bookmark[]) => {
      this.devices = this.nabtoService.getPublicInfo(bookmarks);
      this.devices.subscribe((next) => this.empty = false );
    }).then(() => {
      this.platform.ready().then(() => {
//TODO	this.nabtoService.prepareInvoke(devIds)
      });
    });
  }

  showVendorPage(event, device) {
    console.log(`item tapped: ${JSON.stringify(device)}`);
    if (device.reachable) {
      this.navCtrl.push(VendorHeatingPage, {
        device: device
      });
    } else {
      this.showToast("Device offline");
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      showCloseButton: true
    });
    toast.present();
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
