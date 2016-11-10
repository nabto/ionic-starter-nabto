import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DiscoverPage } from '../discover/discover';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  showDiscoverPage() {
    this.navCtrl.push(DiscoverPage);
  }

}
