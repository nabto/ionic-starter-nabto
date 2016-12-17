import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';
import { Storage } from '@ionic/storage';

// uses https://github.com/driftyco/ionic-storage

@Injectable()
export class BookmarksService {

  private key: string = 'bookmarks_3';
  
  constructor (private storage: Storage) {
  }
  
  public readBookmarks(): Promise<any[]> {
    return this.storage.get(this.key);
  }

  public writeBookmarks(bookmarks: NabtoDevice[]) {
    this.storage.set(this.key, bookmarks);    
  }

  public addBookmark(device: NabtoDevice) {
    console.log(`adding bookmark ${device.id}`);
    this.readBookmarks().then((bookmarks: NabtoDevice[]) => {
      if (!bookmarks) {
        bookmarks = [];
      }
      for (let bookmark of bookmarks) {
        if (bookmark.id == device.id) {
          console.log(`bookmark for ${device.id} already exists, will not add`);
          return;
        }
      }
      bookmarks.push(device);
      this.writeBookmarks(bookmarks);
      console.log(`added ${device.id} to bookmarks`);
    }).catch((error) => {
      console.log(`Some error occurred: ${error}`);
    });
  }

  public clear() {
    this.storage.remove(this.key);
  }
  
}

