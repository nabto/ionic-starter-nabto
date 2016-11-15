import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';
import { Storage } from '@ionic/storage';

@Injectable()
export class BookmarksService {

  constructor (private storage: Storage) {
  }
  
  public readBookmarks(): Promise<NabtoDevice[]> {
    return this.storage.get('bookmarks');
  }

  public writeBookmarks(bookmarks: NabtoDevice[]) {
    this.storage.set('bookmarks', bookmarks);    
  }  
  
}

