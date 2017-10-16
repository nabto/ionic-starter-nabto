import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { BookmarksService } from '../../app/bookmarks.service';
import { NabtoService } from '../../app/nabto.service';
import { ProfileService } from '../../app/profile.service';

declare var NabtoError;

@IonicPage()
@Component({
  templateUrl: 'client-settings.html'
})
export class ClientSettingsPage {

  operatingSystem: string;
  dirty: boolean;
  keyName: string;
  fingerprint: string;

  constructor(public viewCtrl: ViewController,
              private bookmarksService: BookmarksService,
              private profileService: ProfileService,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private navCtrl: NavController,
              private toastCtrl: ToastController,
              private nabtoService: NabtoService
             ) {}

  ionViewDidLoad() {
    this.operatingSystem = (<any>window).device.platform;
    this.dirty = false;
  }

  ionViewDidEnter() {
    this.updateFingerPrint();
  }

  updateFingerPrint() {
    this.profileService.lookupKeyPairName()
      .then((name) => {
        this.keyName = name;
        return this.nabtoService.getFingerprint(name);
      })
      .then((fingerprint) => {
        this.fingerprint = fingerprint.replace(/(.{2}(?=.))/g,"$1:");
      })
      .catch((error) => {
        console.log("Error getting name/fingerprint: " + JSON.stringify(error));
        this.showToast(error.message);
        if (error.code == NabtoError.Code.API_OPEN_CERT_OR_PK_FAILED) {
          this.showProfilePage();
        }
      });
  }
  
  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 4000
    });
    toast.present();
  }

  clearProfile() {
    this.clear(`Are you sure you want to remove the currently active keypair? You must factory reset devices that you are owner of to be owner again with the new key.`, () => {
      this.dirty = true;
      this.profileService.clear();
      this.showProfilePage();
    });
  }
  
  showProfilePage() {
    let modal = this.modalCtrl.create('ProfilePage', undefined, {
      enableBackdropDismiss: false,
      /* hardwareBackButtonClose: false */
    });
    modal.onDidDismiss(() => this.updateFingerPrint());
    modal.present();
  }
  
  clearDevices() {
    this.clear('Do you want to clear list of known devices?', () => {
      this.dirty = true;
      this.bookmarksService.clear();
    });
  }

  clear(message: string, handler: () => void) {    
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: handler
        }
    ]
    });
    alert.present();
  }

  home() {
    this.navCtrl.popToRoot();
  }
}
