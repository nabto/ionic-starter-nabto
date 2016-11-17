import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';

@Component({
  selector: 'page-vendor-heating',
  templateUrl: 'vendor-heating.html'
})
export class VendorHeatingPage {

  device: NabtoDevice;
  activated: boolean;
  temperature: number;
  mode: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.device = navParams.get('device');
    this.temperature = 22;
    this.activated = true;
    this.mode = "heat";
  }

  ionViewDidLoad() {
    console.log('Hello VendorHeatingPage Page');
  }

  activationToggled() {
    console.log("Activation toggled - state is now " + this.activated);
  }

  tempChanged(temp) {
    console.log(`Temperature changed - value is now ${this.temperature}, event temp is ${temp}`);
    this.temperature = temp;
  }

  refresh() {
    console.log("refresh");    
  }

  showSettings() {
    console.log("settings");    
  }


}
