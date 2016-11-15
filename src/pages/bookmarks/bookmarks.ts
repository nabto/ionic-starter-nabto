import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { NabtoDevice } from '../../app/nabto.service';
import { DiscoverPage } from '../discover/discover';


@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html'
})
export class BookmarksPage {

  public devices: Observable<NabtoDevice[]>;
  private deviceSrc: NabtoDevice[] = [];
  public shortTitle: string;
  public longTitle: string;

  constructor(public navCtrl: NavController)
  {
    this.shortTitle = "Devices";
    this.longTitle = "Known devices";
  }

  ionViewDidLoad() {
    this.devices = Observable.of(this.deviceSrc);
    let bookmarks = [];
    bookmarks.push(new NabtoDevice('My bookmarked device 1', 'demo.nabto.net', 'LG Premium 1000'));
    bookmarks.push(new NabtoDevice('My bookmarked device 2', 'demo.nabto.net', 'LG Premium 2000'));
    for(let i = 0; i < bookmarks.length; i++) {
      this.deviceSrc.push(bookmarks[i]);
    }
  }

  itemTapped(event, device_id) {
    alert('TODO: show actual device page for ' + device_id);
  }

  add() {
    this.navCtrl.push(DiscoverPage);
  }

}
