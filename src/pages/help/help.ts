import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'help.html'
})
export class HelpPage {

  constructor(public viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss(name);
  }
  
}
