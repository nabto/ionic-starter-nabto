import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ToastController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';

declare var nabto;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = BookmarksPage;

  error(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    Splashscreen.hide();
    toast.present();
  }
  

  constructor(platform: Platform, public toastCtrl: ToastController, http: Http) {
    platform.ready().then(() => {
      nabto.startup(() => {
        http.get("nabto/unabto_queries.xml")
          .toPromise()
          .then((res: Response) => {
            nabto.rpcSetDefaultInterface(res.text(), (err: any) => {
              if (!err) {
                StatusBar.styleDefault();
                Splashscreen.hide();
              } else {
                console.log(err);
                this.error("Could not inject device interface definition - please contact app vendor" + err.message);
              }
            })
          })
          .catch(err => {
            console.log(err);
            this.error("Could not load device interface definition - please contact app vendor" + err.message);
            return;
          });
      });
    });
    /*
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

      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      nabto.startup(() => {
        StatusBar.styleDefault();
        Splashscreen.hide();
      });
    });*/
  }
}
