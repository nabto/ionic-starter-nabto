import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceUser, NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';
import { BookmarksService } from '../../app/bookmarks.service';
import { ProfileService } from '../../app/profile.service';
import { Customization } from '../../app/customization.class';

@IonicPage()
@Component({
  selector: 'page-pairing',
  templateUrl: 'pairing.html'
})
export class PairingPage {
  device: NabtoDevice;
  shortTitle: string;
  longTitle: string;
  operatingSystem: string;
  success: boolean;
  busy: boolean;
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
	      private nabtoService: NabtoService,
              private profileService: ProfileService,
              private bookmarksService: BookmarksService) {
    this.device = navParams.get('device');
    this.shortTitle = navParams.get('shortTitle');
    this.longTitle = navParams.get('longTitle');
    this.success = false;
    this.busy = false;
    console.log(`pairing with device ${this.device.name}`);
  }
  
  ionViewDidLoad() {
    this.operatingSystem = (<any>window).device.platform;
  }
  
  pair() {
    this.profileService.lookupKeyPairName()
      .then((name) => {
        return this.nabtoService.pairWithCurrentUser(this.device, name);
      })
      .then((user: DeviceUser) => {
        this.writeBookmark();
        this.success = true;
        this.device.currentUserIsOwner = user.isOwner();
      })
      .catch(error => {
        this.handleError(error);        
      });
  }

  handleError(error: any) {
    let toast = this.toastCtrl.create({
      message: error.message,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }
  
  back() {
    this.navCtrl.popToRoot();
  }

  writeBookmark() {
    this.bookmarksService.addBookmarkFromDevice(this.device);
  }

  showVendorPage() {
    this.navCtrl.push(Customization.vendorPage, {
      device: this.device
    });
  }

  home() {
    this.navCtrl.popToRoot();
  }

}
