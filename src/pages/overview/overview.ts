import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { ProfileService } from '../../app/profile.service';
import { Bookmark, BookmarksService } from '../../app/bookmarks.service';
import { NabtoService } from '../../app/nabto.service';
import { Subject } from 'rxjs/Subject';
import { Customization } from '../../app/customization.class';

/*
 * Root page with overview of known devices and entry point for adding new devices.
 * 
 * For any Nabto operations to work, a user profile must be
 * present. The profile creation page is hence shown in the following
 * cases:
 *
 * 1) first app launch
 * 
 * 2) after re-creation of key
 *
 * 3) if there is any problem reading the key
 */
@IonicPage()
@Component({
  templateUrl: 'overview.html'
})
export class OverviewPage {

  public devices: Observable<NabtoDevice[]>;
  public deviceInfoSource: Subject<NabtoDevice[]>;
  empty: boolean;
  firstView: boolean = true;
  
  constructor(private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private platform: Platform,
              private modalCtrl: ModalController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private events: Events,
              private navCtrl: NavController,
              private nabtoService: NabtoService)
  {
    this.deviceInfoSource = new Subject<NabtoDevice[]>();
    this.devices = this.deviceInfoSource.asObservable();
    this.devices.subscribe((next) => {
      console.log("Got devices for overview: " + JSON.stringify(next));
    });

  }

  badImage(device: NabtoDevice) {
    device.setUnknownIcon();
    console.log("No icon for " + JSON.stringify(device));
  }
  
  ionViewDidLoad() {
    this.events.subscribe("overview:profileLoaded", () => this.refresh());
    this.verifyPlumbing()
      .then(() => this.initialize())
      .catch((err) => console.error("App could not start: " + err.message || err));
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

  verifyPlumbing(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nabtoService.checkNabto()
        .then((version) => {
          console.log(`Nabto SDK ${version} installed and working`);
          resolve(undefined);
        })
        .catch((err) => {
          if (err.message) {
            console.log("err.message=[" + err.message + "]");
            console.log("err.message===[NA...]? " + err.message === 'NABTO_NOT_AVAILABLE' ? "yes" : "no");
          } else {
            console.log("err.message is undefined");
          }                                          
          if (err && err.message && err.message === 'NABTO_NOT_AVAILABLE') {
            this.showToast("Installation problem: Nabto SDK not available, please contact vendor", true);
          } else {
            console.log("Could not get SDK version: " + (err.message || err));
          }
          reject(err);
        })
        .catch(() => {
          console.log("Unspecified error");
          reject(new Error("Unspecified error"));
        });

    });
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
            .then(() => this.navCtrl.push('ProfilePage', { hideBack: true }))
            .catch((err) => console.log(`An error occurred: ${err}`));
        }
      })
      .catch((err) => {
        console.log(`An error occurred: ${err}`);
        this.navCtrl.push('ProfilePage', { hideBack: true });
      });
  }
  
  initializeWithKeyPair(name: string) {
    this.nabtoService.startupAndOpenProfile(name)
      .then(() => this.events.publish('overview:profileLoaded'))
      .catch((error) => {
        if (error && error.message && error.message === 'BAD_PROFILE') {
          this.navCtrl.push('ProfilePage', { hideBack: true });
        } else {
          this.showAlert("App could not start, please contact vendor: " + error.message || error);
        }
      });
  }

  refresh() {
    this.bookmarksService.readBookmarks().then((bookmarks: Bookmark[]) => {
      console.log("got bookmarks: " + JSON.stringify(bookmarks));
      this.nabtoService.prepareInvoke(bookmarks.map((bookmark) => bookmark.id))
        .then(() => {
          // listview observes this.devices and will be populated as data is received
          this.nabtoService.getPublicInfo(bookmarks, this.deviceInfoSource);
        });
    }).catch((error) => {
      this.showToast(error.message || error);
    });
  }

  deviceTapped(event, device) {
    console.log(`item tapped: ${JSON.stringify(device)}`);
    if (device.reachable) {
      if (device.currentUserIsPaired) {
        this.navCtrl.push(Customization.vendorPage, {
          device: device
        });
      } else {
        if (device.openForPairing) {
          this.navCtrl.push('PairingPage', {
            device: device,
            shortTitle: "Pair device",
            longTitle: "Pair local device"
          });
        } else {
          this.showToast("Device not open for pairing - please contact owner (or factory reset if you are the owner)");
        }
      }
    } else {
      this.showToast(`Device ${device.id} not reachable or is not supported`);
    }
  }

  showToast(message: string, stayOnScreen?: boolean) {
    let options:any = {
      message: message,
      showCloseButton: false
    };
    if (!stayOnScreen) {
      options.duration = 3000;
    };
    let toast = this.toastCtrl.create(options);
    toast.present();
  }
  
  addNewDevice() {
    this.navCtrl.push('DiscoverPage');
  }
  
  showHelpPage() {
    this.navCtrl.push('HelpPage');
  }

  showSettingsPage() {
    this.navCtrl.push('ClientSettingsPage');
  }

  showAlert(message: string, title?: string) {
    let alert = this.alertCtrl.create({
      title: title ? title : 'Error',
      message: message,
      enableBackdropDismiss: false,
      buttons: [{ text: 'Ok' }]
    });
    alert.present();
  }

}
