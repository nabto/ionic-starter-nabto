import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';
import { Storage } from '@ionic/storage';

// uses https://github.com/driftyco/ionic-storage

// serializable with simple JSON parse/stringify
export class Bookmark {
  public id: string;
  public name: string;
  public product: string;
  public iconUrl: string;
}

@Injectable()
export class BookmarksService {

  private key: string = 'bookmarks_5';
  
  constructor (private storage: Storage) {
  }
  
  public readBookmarks(): Promise<Bookmark[]> {
    return this.storage.get(this.key).then((value:string) => {
      if (value) {
        console.log(`Parsing bookmarks string [${value}]`);
        var bookmarks:Bookmark[] = JSON.parse(value);
        return bookmarks;
      } else {
        return [];
      }
    });
  }

  public createBookmark(device: NabtoDevice): Bookmark {
    let bookmark: Bookmark = new Bookmark();
    bookmark.id = device.id;
    bookmark.name = device.name;
    bookmark.product = device.product;
    bookmark.iconUrl = device.iconUrl;
    return bookmark;
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

