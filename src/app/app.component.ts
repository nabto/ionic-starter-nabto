import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ToastController } from 'ionic-angular';
import { OverviewPage } from '../pages/overview/overview';
import { OneSignal } from 'ionic-native';


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

        ////// ONE SIGNAL SETUP /////
        OneSignal.startInit("58a88e8b-83f1-429d-8863-8d8180ae83ed", "242279958126");
        OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.InAppAlert);
        OneSignal.setSubscription(true);
        OneSignal.handleNotificationReceived().subscribe(() => {
          // do something when the notification is received.
        });
        OneSignal.handleNotificationOpened().subscribe(() => {
          // do something when the notification is opened.
        });
        OneSignal.endInit();    
        OneSignal.getIds().then(data => {
          console.warn("OneSignal userId: " + data.userId);
          // this gives you back the new userId and pushToken associated with the device. Helpful.
        });
        
      });
  }

}
