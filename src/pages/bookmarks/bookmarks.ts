import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { NabtoDevice } from '../../app/device.class';
import { DiscoverPage } from '../discover/discover';
import { BookmarksService } from '../../app/bookmarks.service';


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

  constructor(public navCtrl: NavController, private bookmarks: BookmarksService) {
    this.shortTitle = "Devices";
    this.longTitle = "Known devices";
    this.empty = true;
  }

  ionViewDidLoad() {
    this.devices = Observable.of(this.deviceSrc);
  }

  itemTapped(event, device_id) {
    alert('TODO: show actual device page for ' + device_id);
  }

  add() {
    this.navCtrl.push(DiscoverPage);
  }

  refresh() {
    this.bookmarks.readBookmarks().then((bookmarks) => {
      for(let i = 0; i < bookmarks.length; i++) {
        this.deviceSrc.push(bookmarks[i]);
      }
      this.empty = (this.deviceSrc.length == 0);
    });
  }
  
  writeTestBookmarks() {
    let bookmarks = [];
    this.bookmarks.writeBookmarks(bookmarks);
    bookmarks.push(new NabtoDevice('My bookmarked device A', 'demo.nabto.net', 'LG Premium 1000'));
    bookmarks.push(new NabtoDevice('My bookmarked device B', 'demo.nabto.net', 'LG Premium 2000', 'img/chip-small.png'));
    this.bookmarks.writeBookmarks(bookmarks);
  }

}
