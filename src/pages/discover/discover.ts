import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PairingPage } from '../pairing/pairing';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { NabtoService } from '../../app/nabto.service';
import { NabtoDevice } from '../../app/device.class';
import { BookmarksService } from '../../app/bookmarks.service';
import { VendorHeatingPage } from '../vendor-heating/vendor-heating';

@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html'
})
export class DiscoverPage {
  empty: boolean;
  busy: boolean;
  longTitle: string;
  shortTitle: string;
  view : ViewController;
  
  public devices: Observable<NabtoDevice[]>;
  private deviceSrc = [];

  ionViewDidLoad() {
    this.devices = Observable.of(this.deviceSrc);
  }

  ionViewDidEnter() {
    this.discover();
  }
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController,
              public platform: Platform,
              private nabtoService: NabtoService,
              private bookmarksService: BookmarksService,
              private zone: NgZone
             ) {
    this.busy = false;
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
  }
  
  onResume(){
	// Will only prepare devices if this page is the active view 
	if(this.navCtrl.getActive() == this.view){
	  var devIds : string[] = [];
	  var devs : NabtoDevice[] = [];
	  for (var i = 0; i < this.deviceSrc.length; i++){
		devs[i] = this.deviceSrc[i];
		devIds[i] = devs[i].id;
	  }
	  this.nabtoService.prepareInvoke(devIds);
	}
  }

  discover(): void {
    this.view = this.navCtrl.getActive();
    this.busy = true;
    this.nabtoService.discover()
      .then(discovered => {
        this.busy = false;
        this.deviceSrc.splice(0, this.deviceSrc.length);
        for(let i = 0; i < discovered.length; i++) {
          this.deviceSrc.push(discovered[i]);
        }
        this.empty = (discovered.length == 0)
        if (this.empty) {
          console.log("no devices found");
        }
      }).catch(error => {
        this.busy = false;
        let toast = this.toastCtrl.create({
          message: error.message,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
        console.log("ERROR discovering devices: " + JSON.stringify(error));
      });
  }
  
  refresh() {
    this.discover();
  }

  itemTapped(event, device) {
    if (device.openForPairing) {
      if (device.currentUserIsOwner) {
        this.handleAlreadyPairedDevice(device);
      } else {
        this.handleUnpairedDevice(device);
      }
    } else {
      if (device.currentUserIsOwner) {
        this.handleAlreadyPairedDevice(device);
      } else {
        this.handleClosedDevice();
      }
    }
  }

  handleAlreadyPairedDevice(device: NabtoDevice) {
    let toast = this.toastCtrl.create({
      message: "Already paired",
      duration: 1000,
      showCloseButton: false
    });
    toast.present();
    // if the user has deleted bookmark, add again
    this.bookmarksService.addBookmark(device);
    this.navCtrl.push(VendorHeatingPage, { // XXX don't depend directly on vendor page here
      device: device
    });
  }

  handleUnpairedDevice(device: NabtoDevice) {
    this.navCtrl.push(PairingPage, {
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


}

