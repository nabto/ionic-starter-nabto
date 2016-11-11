import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ToastController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';

declare var nabto;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;
  
  constructor(platform: Platform, public toastCtrl: ToastController) {
    platform.ready().then(() => {
      if (nabto) {
        console.log("app started - nabto is available");
      } else {
        console.log("app started - nabto is not available");
        if (<any>window) {
          console.log("app started - window available");
          if ((<any>window).plugins) {
            console.log("app started - window.plugins available");
            if ((<any>window).plugins.nabto) {
              console.log("app started - window.plugins.nabto available");
            } else {
              console.log("app started - window.plugins.nabto not available");
            }
          } else {
            console.log("app started - window.plugins not available");
          }
        } else {
          console.log("app started - window not available");
        }

        const toast = this.toastCtrl.create({
          message: "Fatal: nabto object is not available - installation failed",
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        Splashscreen.hide();
        toast.present();
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      nabto.startup(() => {
        StatusBar.styleDefault();
        Splashscreen.hide();
      });
    });
  }
}
