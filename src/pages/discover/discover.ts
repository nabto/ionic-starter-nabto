import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController, NavParams } from 'ionic-angular';
import { PairingPage } from '../pairing/pairing';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { OnInit } from '@angular/core';

import { NabtoService, NabtoDevice } from '../../app/nabto.service';

//declare var nabto;

@Component({
  templateUrl: 'discover.html'
})
export class DiscoverPage implements OnInit {
  empty: boolean;
  longTitle: string;
  shortTitle: string;

  public devices: Observable<NabtoDevice[]>;

  private deviceSrc = [];

  ngOnInit(): void {
    this.devices = Observable.of(this.deviceSrc);
//    this.discover();  // apparently this breaks chrome and livereload??!
  }
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public platform: Platform,
              private nabtoService: NabtoService,
              private zone: NgZone
              ) {

    this.longTitle = navParams.get('longTitle');
    if (!this.longTitle) {
      this.longTitle = "Discover local devices";
    }

    this.shortTitle = navParams.get('shortTitle');
    if (!this.shortTitle) {
      this.shortTitle = "Discover";
    }    
  }

  discover(): void {
    this.nabtoService.discover()
      .then(discovered => {
        this.deviceSrc.splice(0, this.deviceSrc.length);
        for(let i = 0; i < discovered.length; i++) {
          console.log(`Added device: ${JSON.stringify(discovered[i])} - name ${discovered[i].name}`);
          this.deviceSrc.push(discovered[i]);
        }
        this.empty = (discovered.length == 0)
        if (this.empty) {
          console.log("no devices found");
        }
      }).catch(error => {
        let toast = this.toastCtrl.create({
          message: error.message,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
        console.log("ERROR discovering devices (await toast!): " + JSON.stringify(error));
      });
  }
           
  refresh() {
    console.log("refresh tapped");
    this.discover();
  }

  itemTapped(event, device) {
    this.navCtrl.push(PairingPage, {
      device_id: device.id
    });
  }
}

