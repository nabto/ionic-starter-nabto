import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';

@Component({
  selector: 'page-vendor-heating',
  templateUrl: 'vendor-heating.html'
})
export class VendorHeatingPage {

  device: NabtoDevice;
  activated: boolean;
  temperature: number;
  mode: string;
  busy: boolean;
  roomTemperature: number;

  constructor(public navCtrl: NavController,
              private nabtoService: NabtoService,
              public toastCtrl: ToastController,
              public navParams: NavParams) {
    this.device = navParams.get('device');
    this.temperature = 22;
    this.activated = true;
    this.mode = "heat";
    this.busy = false;
  }

  ionViewDidLoad() {
    this.refresh();
  }

  refresh() {
    this.busy = true;
    this.nabtoService.invokeRpc(this.device, "heatpump_get_full_state.json").
      then((state: any) => {
        this.busy = false;
        this.activated = state.activated;
        this.mode = state.mode;
        this.temperature = state.target_temperature;
        this.roomTemperature = state.room_temperature;
      }).catch(error => {
        this.busy = false;
        let toast = this.toastCtrl.create({
          message: error.message,
          showCloseButton: true,
          closeButtonText: 'Ok'
        });
        toast.present();
        console.log("ERROR invoking device: " + JSON.stringify(error));
      });
  }
  
  activationToggled() {
    console.log("Activation toggled - state is now " + this.activated);
  }

  tempChanged(temp) {
    console.log(`Temperature changed - value is now ${this.temperature}, event temp is ${temp}`);
    this.temperature = temp;
  }

  showSettings() {
    console.log("settings");    
  }

  touchEnd() {
    console.log("touchEnd");    
  }

  increment() {
    this.temperature++;
  }

  decrement() {
    this.temperature--;
  }
}
