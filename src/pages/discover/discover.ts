import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { NavController, NavParams } from 'ionic-angular';
import { PairingPage } from '../pairing/pairing';
import { ToastController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

export class Device {
  name: string;
  id: string;
  product: string;
  iconUrl: string;

  // iconUrl is absolute or relative to bundle's www folder, e.g. use img/mydevice.png from device and put image in www/img/mydevice.png
  constructor(name: string,
              id: string,
              product: string,
              iconUrl: string)   
  {
    this.name = name;
    this.id = id;
    this.product = product;
    this.iconUrl = iconUrl;
  }
}

declare var nabto;

@Component({
  templateUrl: 'discover.html'
})
export class DiscoverPage {
  empty: boolean;
  longTitle: string;
  shortTitle: string;

  public devices: Observable<Device[]>;

  private deviceSrc = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public platform: Platform,
              private zone: NgZone) {
    
    this.longTitle = navParams.get('longTitle');
    if (!this.longTitle) {
      this.longTitle = "Discover local devices";
    }

    this.shortTitle = navParams.get('shortTitle');
    if (!this.shortTitle) {
      this.shortTitle = "Discover";
    }
    
    
    this.deviceSrc = [];
    this.devices = Observable.of(this.deviceSrc);
    this.discover();        
  }
  
  discover() {
    nabto.getLocalDevices((error: any, devices: any) => {

      console.log(`getLocalDevices callback - error: ${error}, devices: ${devices}`);
      
      if (error) {
        const toast = this.toastCtrl.create({
          message: error.message,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        console.log("ERROR discovering devices: " + JSON.stringify(error));
        toast.present();
        return;
      }

      console.log("discover got devices: " + JSON.stringify(devices));

      this.zone.run(() => {
        this.deviceSrc.splice(0, this.deviceSrc.length);
        for(let i = 0; i < devices.length; i++) {
          console.log("adding device " + i + " to list: " + devices[i]);
          this.deviceSrc.push(new Device(`Sommerhus Stuen`, devices[i], 'ACME 9000 Heatpump', 'img/chip.png'));
          this.deviceSrc.push(new Device(`Sommerhus Stuen`, devices[i], 'ACME 9000 Heatpump', 'http://www.heatpumps4pools.com/myfiles/image/spare-parts-image-2.jpg'));
        }
        this.empty = (devices.length == 0);
      })

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


