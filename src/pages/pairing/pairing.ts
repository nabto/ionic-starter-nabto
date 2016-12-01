import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { LoadingController } from 'ionic-angular';
import { BookmarksService } from '../../app/bookmarks.service';
import { VendorHeatingPage } from '../vendor-heating/vendor-heating';
import { NabtoService } from '../../app/nabto.service';

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
  loader: any;
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
			  private nabtoService: NabtoService,
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
  
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Pairing...",
    });
    this.loader.present();
  }

  pair() {
    this.presentLoading();
    setTimeout(() => {
      this.writeBookmark();
      this.loader.dismiss();
	  this.success = true;
    }, 2000) ;
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
