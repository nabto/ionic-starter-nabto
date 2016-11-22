import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NabtoDevice } from '../../app/device.class';
import { NabtoService } from '../../app/nabto.service';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-vendor-heating',
  templateUrl: 'vendor-heating.html'
})
export class VendorHeatingPage {

  device: NabtoDevice;
  activated: boolean;
  temperature: number;
  mode: string;
  roomTemperature: number;
  maxTemp: number;
  minTemp: number;
  timer: any;
  spinner: any;

  constructor(public navCtrl: NavController,
              private nabtoService: NabtoService,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {
    this.device = navParams.get('device');
    this.temperature = undefined;
    this.activated = false;
    this.mode = undefined;
    this.maxTemp = 30;
    this.minTemp = 16;
    this.timer = undefined;
  }

  ionViewDidLoad() {
    this.refresh();
  }

  armSpinnerTimer() {
    this.timer = setTimeout(() => this.showSpinner(), 250);
  }

  cancelSpinner() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.spinner) {
      this.spinner.dismiss();
    }
  }
  
  refresh() {
    this.armSpinnerTimer();
    this.nabtoService.invokeRpc(this.device, "heatpump_get_full_state.json").
      then((state: any) => {
        this.cancelSpinner();
        this.activated = state.activated;
        this.mode = this.mapDeviceMode(state.mode);
        this.temperature = this.mapDeviceTemp(state.target_temperature);
        this.roomTemperature = state.room_temperature;
      }).catch(error => {
        this.cancelSpinner();
        this.handleError(error.message);
      });
  }

  activationToggled() {
    console.log("Activation toggled - state is now " + this.activated);
    this.armSpinnerTimer();
    this.nabtoService.invokeRpc(this.device, "heatpump_set_activation_state.json",
                                { "activated": this.activated ? 1 : 0 }).
      then((state: any) => {
        this.cancelSpinner();
        this.activated = state.activated;
      }).catch(error => {
        this.cancelSpinner();
        this.handleError(error.message);
      });
  }

  tempChanged(temp) {
    console.log(`Temperature changed - value is now ${this.temperature}, event temp is ${temp}`);
    this.temperature = temp;
    this.updateTargetTemperature();
  }

  increment() {
    if (this.activated) { // we cannot disable tap events on icon in html
      if (this.temperature < this.maxTemp) {
        this.temperature++;
      }
      this.updateTargetTemperature();
    }
  }

  decrement() {
    if (this.activated) { // we cannot disable tap events on icon in html
      if (this.temperature > this.minTemp) {
        this.temperature--;
      }
      this.updateTargetTemperature();
    }
  }

  updateTargetTemperature() {
    // XXX: no spinner as long as we don't debounce and invoke device every time (it yields odd behavior)
    this.nabtoService.invokeRpc(this.device, "heatpump_set_target_temperature.json",
                                { "temperature": this.temperature }).
      then((state: any) => {
        this.temperature = state.temperature;
      }).catch(error => {
        this.handleError(error.message);
      });
  }

  updateMode() {
    this.armSpinnerTimer();
    this.nabtoService.invokeRpc(this.device, "heatpump_set_mode.json",
                                { "mode": this.mapToDeviceMode(this.mode) }).
      then((state: any) => {
        this.cancelSpinner();
        this.mode = this.mapDeviceMode(state.mode);
      }).catch(error => {
        this.cancelSpinner();
        this.handleError(error.message);
      });
  }
  
  mapDeviceMode(mode: number) {
    switch (mode) {
    case 0: return "cool";
    case 1: return "heat";
    case 2: return "circulate";
    case 3: return "dehumidify";
    default: return "unknown";
    }
  }

  mapToDeviceMode(mode: string) {
    switch (mode) {
    case "cool": return 0;
    case "heat": return 1;
    case "circulate": return 2;
    case "dehumidify": return 3;
    default: return -1;
    }
  }

  mapDeviceTemp(tempFromDevice: number) {
    if (tempFromDevice < this.minTemp) {
      return this.minTemp;
    } else if (tempFromDevice > this.maxTemp) {
      return this.maxTemp;
    } else {
      return tempFromDevice;
    }
  }

  handleError(error: string) {
    let toast = this.toastCtrl.create({
      message: error,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
    console.log("ERROR invoking device: " + JSON.stringify(error));
  }

  showSpinner() {
    this.spinner = this.loadingCtrl.create({
      content: "Invoking device...",
    });
    this.spinner.present();
  }


  showSettings() {
    console.log("settings");    
  }

  touchEnd() {
    console.log("touchEnd");    
  }
 
}
