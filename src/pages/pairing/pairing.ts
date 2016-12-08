import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';
<<<<<<< HEAD
=======
import { LoadingController } from 'ionic-angular';
>>>>>>> 5150c66fa24d07b4473871875a2cba85ea606984
import { BookmarksService } from '../../app/bookmarks.service';
import { VendorHeatingPage } from '../vendor-heating/vendor-heating';
import { ProfileService } from '../../app/profile.service';

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
      .then((profileName) => {
        this.nabtoService.invokeRpc(this.device, "pair_with_device.json", { "user_name": profileName}).
          then((pairedUser: any) => {
            console.log("Got paired user: " + JSON.stringify(pairedUser));
            this.writeBookmark();
            this.success = true;
          }).catch(error => {
            //        this.handleError(error);        
          });
      });
  }

  back() {
    this.navCtrl.popToRoot();
  }

  writeBookmark() {
    this.bookmarksService.addBookmark(this.device);
  }

  showVendorPage() {
    this.navCtrl.push(VendorHeatingPage, {
      device: this.device
    });
  }

}
