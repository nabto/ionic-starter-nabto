import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { ToastController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { OverviewPage } from '../pages/overview/overview';

declare var nabto;

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
  }
}
