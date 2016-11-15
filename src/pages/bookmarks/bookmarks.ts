import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { NabtoDevice } from '../../app/device.class';
import { DiscoverPage } from '../discover/discover';
import { BookmarksService } from '../../app/bookmarks.service';
import { AlertController } from 'ionic-angular';


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
              private alertCtrl: AlertController) {
    this.shortTitle = "Devices";
    this.longTitle = "Known devices";
    this.empty = true;
  }

  ionViewDidLoad() {
    this.devices = Observable.of(this.deviceSrc);
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

  itemTapped(event, device_id) {
    alert('TODO: show actual device page for ' + device_id);
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
   
}
