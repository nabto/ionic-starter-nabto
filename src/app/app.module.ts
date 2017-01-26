import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NabtoIonicApp } from './app.component';
import { NabtoService } from './nabto.service';
import { BookmarksService } from './bookmarks.service';
import { ProfileService } from './profile.service';
import { DiscoverPage } from '../pages/discover/discover';
import { PairingPage } from '../pages/pairing/pairing';
import { OverviewPage } from '../pages/overview/overview';
import { VendorHeatingPage } from '../pages/vendor-heating/vendor-heating';
import { ProfilePage } from '../pages/profile/profile';
import { ClientSettingsPage } from '../pages/client-settings/client-settings';
import { DeviceSettingsPage } from '../pages/device-settings/device-settings';
import { HelpPage } from '../pages/help/help';
import { SecurityPage } from '../pages/security/security';
import { AclEditPage } from '../pages/acl-edit/acl-edit';

export function provideStorage() {
 return new Storage(['sqlite'], { name: '__ampdb' });
}

@NgModule({
  declarations: [
    NabtoIonicApp,
    DiscoverPage,
    PairingPage,
    OverviewPage,
    VendorHeatingPage,
    ProfilePage,
    ClientSettingsPage,
    DeviceSettingsPage,
    SecurityPage,
    AclEditPage,
    HelpPage
  ],
  imports: [
    IonicModule.forRoot(NabtoIonicApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NabtoIonicApp,
    DiscoverPage,
    PairingPage,
    OverviewPage,
    VendorHeatingPage,
    ProfilePage,
    ClientSettingsPage,
    DeviceSettingsPage,
    SecurityPage,
    AclEditPage,
    HelpPage
  ],
  providers: [ProfileService, NabtoService, BookmarksService, Storage]
})
export class AppModule {}
