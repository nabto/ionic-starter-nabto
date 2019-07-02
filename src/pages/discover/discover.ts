import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NabtoService } from '../../app/nabto.service';
import { NabtoDevice } from '../../app/device.class';
import { Bookmark, BookmarksService } from '../../app/bookmarks.service';
import { Subject } from 'rxjs/Subject';
import { Customization } from '../../app/customization.class';

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html'
})
export class DiscoverPage {
  busy: boolean;
  longTitle: string;
  shortTitle: string;
  view : ViewController;

  public devices: Observable<NabtoDevice[]>;
  public deviceInfoSource: Subject<NabtoDevice[]>;
  private recentIds: string[];
  private manuallyAddedDevices: string[] = [];

  ionViewDidEnter() {
    this.view = this.navCtrl.getActive();
    this.refresh();
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public platform: Platform,
              private nabtoService: NabtoService,
              private bookmarksService: BookmarksService
             ) {
    this.longTitle = navParams.get('longTitle');
    if (!this.longTitle) {
      this.longTitle = "Discover local devices";
    }
    this.shortTitle = navParams.get('shortTitle');
    if (!this.shortTitle) {
      this.shortTitle = "Discover";
    }
    document.addEventListener('resume', () => {
      this.onResume();
    });
    this.deviceInfoSource = new Subject<NabtoDevice[]>();
    this.devices = this.deviceInfoSource.asObservable();
    this.devices.subscribe((next) => {
      console.log("Got devices for discover: " + JSON.stringify(next));
    });
  }

  badImage(device: NabtoDevice) {
    console.log("No icon for " + JSON.stringify(device));
    device.setUnknownIcon();
  }

  onResume() {
    // Will only prepare devices if this page is the active view after resume
    if (this.navCtrl.getActive() == this.view) {
      this.nabtoService.prepareInvoke(this.recentIds);
    }
  }

  refresh() {
    this.busy = true;
    if (this.manuallyAddedDevices.length > 0) {
      this.prepareDevices(this.manuallyAddedDevices);
    }
    this.nabtoService.discover().then((ids: string[]) => {
      this.prepareDevices(ids);
    }).catch((error) => {
      this.showToast(error.message);
      console.error("Error discovering devices: " + JSON.stringify(error));
      this.busy = false;
    });
  }

  prepareDevices(ids: string[]) {
    this.busy = false;
    this.nabtoService.prepareInvoke(ids).then(() => {
      // listview observes this.devices and will be populated as data is received
      this.nabtoService.getPublicInfo(ids.map((id) => new Bookmark(id)), this.deviceInfoSource);
      this.recentIds = ids;
    });
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000
    });
    toast.present();
  }

  itemTapped(event, device) {
    if (!device.reachable) {
      this.showToast(device.description);
      return;
    }
    if (device.hasInterfaceInfo) {
      this.attemptPair(device);
    } else {
      this.handleNoInterfaceInfo(() => this.attemptPair(device));
    }
  }

  attemptPair(device: NabtoDevice) {
    if (device.openForPairing) {
      if (device.currentUserIsPaired) {
        this.handleAlreadyPairedDevice(device);
      } else {
        this.handleUnpairedDevice(device);
      }
    } else {
      if (device.currentUserIsPaired) {
        this.handleAlreadyPairedDevice(device);
      } else {
        this.handleClosedDevice();
      }
    }

  }

  handleNoInterfaceInfo(continueHandler: any) {
    let alert = this.alertCtrl.create({
      title: 'Firmware upgrade recommended',
      message: 'This device does not support strict interface checking. It is highly recommended to upgrade the device firmware to support this (contact your vendor). Do you want to continue anyway for now?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Continue',
          handler: continueHandler
        }
      ]
    });
    alert.present();
  }

  isAccessible(device) {
    return device.openForPairing || device.currentUserIsOwner;
  }

  handleAlreadyPairedDevice(device: NabtoDevice) {
    let toast = this.toastCtrl.create({
      message: "Already paired",
      duration: 1000,
      showCloseButton: false
    });
    toast.present();
    // if the user has deleted bookmark, add again
    this.bookmarksService.addBookmarkFromDevice(device);
    this.navCtrl.push(Customization.vendorPage, {
      device: device
    });
  }

  handleUnpairedDevice(device: NabtoDevice) {
    this.navCtrl.push('PairingPage', {
      device: device,
      shortTitle: "Pair device",
      longTitle: "Pair local device"
    });
  }

  handleClosedDevice() {
    let alert = this.alertCtrl.create({
      title: 'Device not open',
      message: "Sorry! This device is not open for pairing, please contact the device owner. Or perform a factory reset if you are the owner of the device but don't have access.",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    alert.present();
  }

  home() {
    this.navCtrl.setRoot('OverviewPage');
    this.navCtrl.popToRoot();
  }

  addManually() {
    let modal = this.modalCtrl.create('DeviceAddPage', undefined, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((deviceId) => {
      if (deviceId) {
        this.manuallyAddedDevices.push(deviceId);
        this.prepareDevices([deviceId]);
      }
    });
    modal.present();
  }

}
