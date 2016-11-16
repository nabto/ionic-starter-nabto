import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NabtoIonicApp } from './app.component';
import { NabtoService } from './nabto.service';
import { BookmarksService } from './bookmarks.service';
import { DiscoverPage } from '../pages/discover/discover';
import { PairingPage } from '../pages/pairing/pairing';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { VendorHeatingPage } from '../pages/vendor-heating/vendor-heating';

@NgModule({
  declarations: [
    NabtoIonicApp,
    DiscoverPage,
    PairingPage,
    BookmarksPage,
    VendorHeatingPage
  ],
  imports: [
    IonicModule.forRoot(NabtoIonicApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NabtoIonicApp,
    DiscoverPage,
    PairingPage,
    BookmarksPage,
    VendorHeatingPage
  ],
  providers: [NabtoService, BookmarksService, Storage]
})
export class AppModule {}
