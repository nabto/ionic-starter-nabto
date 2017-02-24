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
        // startInit takes the app-id retreived from https://onesignal.com/apps/
        // and the google project id retreived from https://console.developers.google.com
        OneSignal.startInit("58a88e8b-83f1-429d-8863-8d8180ae83ed", "242279958126");
        // sets up the PN alerts and subscriptions
        OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.InAppAlert);
        OneSignal.setSubscription(true);
        /* function called when PN is received,
         * In case we check if its a silent notification (ie. from uNabto)
         * If so, we read the contents and create a non-silent notification for the user
         */
        OneSignal.handleNotificationReceived().subscribe((JsonData) => {
          // do something when the notification is received.
          console.log("ONESIGNAL NOTIFICATION RECEIVED: " + JSON.stringify(JsonData));
          if(JsonData.shown == false){
            OneSignal.getIds().then(ids => {
              var notificationObj = { contents: {en: "Temperature is " + JsonData.payload.additionalData.body.temp + ". Your house might be on fire"},
                                      app_id: "58a88e8b-83f1-429d-8863-8d8180ae83ed",
                                      include_player_ids: [ids.userId]};
              OneSignal.postNotification(notificationObj);
            });
          }
        });
        // function called when the user opens a notification, unused here
        OneSignal.handleNotificationOpened().subscribe(() => {
          console.log("ONESIGNAL NOTIFICATION OPENED");
          // do something when the notification is opened.
        });
        OneSignal.endInit();
        // Get the Player ID for this device.
        // This is the ID the uNabto device must use as Player_id when sending a PN
        OneSignal.getIds().then(data => {
          console.warn("OneSignal userId: " + data.userId);
          // this gives you back the new userId and pushToken associated with the device. Helpful.
        });
        
      });
  }

}
