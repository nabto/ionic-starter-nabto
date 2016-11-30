import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ToastController } from 'ionic-angular';
import { OverviewPage } from '../pages/overview/overview';
import { NabtoService } from './nabto.service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class NabtoIonicApp {
  rootPage = OverviewPage;

  error(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    Splashscreen.hide();
    toast.present();
  }

  initialize() {
    console.log("Nabto started successfully");
    StatusBar.styleDefault();
    Splashscreen.hide();
  }

  constructor(platform: Platform,
              public toastCtrl: ToastController,
              private nabtoService: NabtoService) {
    platform.ready()
      .then(() => nabtoService.startup())
      .then(() => this.initialize())
      .catch((err) => {
        console.log(err);
        this.error("Could not startup nabto - please contact app vendor: " + err.message);
      });
  }
}
