import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';

// uses https://github.com/driftyco/ionic-storage

// serializable with simple JSON parse/stringify
export class Bookmark {
  public id: string;
  public name: string;
  public product: string;
  public iconUrl: string;
  constructor(id: string,
              name?: string,
              product?: string,
              iconUrl?: string) {
    this.id = id;
    this.name = name ? name : id;
    this.product = product ? product : "Unknown";
    this.iconUrl = undefined;
  }
}

@Injectable()
export class BookmarksService {

  private key: string = 'bookmarks';
  
  constructor (private storage: Storage) {
  }
  
  public readBookmarks(): Promise<Bookmark[]> {
    return this.storage.get(this.key).then((value:string) => {
      var bookmarks:Bookmark[] = [];
      if (value) {
        console.log(`Parsing bookmarks string [${value}]`);
        try {
           bookmarks = JSON.parse(value);
        } catch (error) {
          this.clear();
        }
      }
      return bookmarks;
    });
  }

  public createBookmark(device: NabtoDevice): Bookmark {
    return new Bookmark(device.id, device.name, device.product, device.iconUrl);
  }
  
  public writeBookmarks(bookmarks: Bookmark[]) {
    let value:string = JSON.stringify(bookmarks);
    this.storage.set(this.key, value);    
  }

  public addBookmarkFromDevice(device: NabtoDevice) {
    console.log(`adding bookmark ${device.id}`);
    this.readBookmarks().then((bookmarks: Bookmark[]) => {
      if (!bookmarks) {
        bookmarks = [];
      }
      for (let bookmark of bookmarks) {
        if (bookmark.id == device.id) {
          console.log(`bookmark for ${device.id} already exists, will not add`);
          return;
        }
      }
      bookmarks.push(this.createBookmark(device));
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

