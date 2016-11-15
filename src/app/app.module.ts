import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { NabtoIonicApp } from './app.component';
import { DiscoverPage } from '../pages/discover/discover';
import { PairingPage } from '../pages/pairing/pairing';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { NabtoService } from './nabto.service';
import { BookmarksService } from './bookmarks.service';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    NabtoIonicApp,
    DiscoverPage,
    PairingPage,
    BookmarksPage
  ],
  imports: [
    IonicModule.forRoot(NabtoIonicApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NabtoIonicApp,
    DiscoverPage,
    PairingPage,
    BookmarksPage
  ],
  providers: [NabtoService, BookmarksService, Storage]
})
export class AppModule {}
