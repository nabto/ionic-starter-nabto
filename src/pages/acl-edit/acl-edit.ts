import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-acl-edit',
  templateUrl: 'acl-edit.html'
})
export class AclEditPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AclEditPage Page');
  }

}
