import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class NabtoIonicApp {

  rootPage:any = 'OverviewPage';

  constructor(platform: Platform,
              private toastCtrl: ToastController,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar) {
    platform.ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
  }

}
