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
  icon: string;
  constructor(name: string, id: string, icon: string) {
    this.name = name;
    this.id = id;
    this.icon = icon;
  }
}

declare var nabto;

@Component({
  templateUrl: 'discover.html'
})
export class DiscoverPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  count: number;

  public devices: Observable<Device[]>;

  private deviceSrc = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public platform: Platform,
              private zone: NgZone) {

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
          this.deviceSrc.push(new Device(`Device ${i}`, devices[i], 'wifi'));
          this.count = devices.length;
        }
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


