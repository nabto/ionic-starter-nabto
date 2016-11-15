import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { DiscoverPage } from '../pages/discover/discover';
import { PairingPage } from '../pages/pairing/pairing';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { NabtoService } from './nabto.service';
import { BookmarksService } from './bookmarks.service';
import { NabtoDevice } from 'device.class';
import { Storage } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DiscoverPage,
    PairingPage,
    BookmarksPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    DiscoverPage,
    PairingPage,
    BookmarksPage
  ],
  providers: [NabtoService, BookmarksService, Storage]
})
export class AppModule {}
