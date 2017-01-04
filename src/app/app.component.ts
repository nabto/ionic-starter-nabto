import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ToastController } from 'ionic-angular';
import { OverviewPage } from '../pages/overview/overview';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class NabtoIonicApp {

  rootPage = OverviewPage;

  constructor(platform: Platform,
              public toastCtrl: ToastController) {
    platform.ready()
      .then(() => {
        StatusBar.styleDefault();
        Splashscreen.hide();
      });
  }

}
