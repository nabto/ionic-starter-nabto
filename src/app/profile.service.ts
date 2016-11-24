import { Injectable } from '@angular/core';
import { NabtoService } from './nabto.service';
import { Storage } from '@ionic/storage';

// uses https://github.com/driftyco/ionic-storage

@Injectable()
export class ProfileService {

  private key: string = 'keypairName';
  
  constructor (private nabtoService: NabtoService,
               private storage: Storage) {
  }
  
  createKeyPair(name: string): Promise<string> {
    return this.nabtoService.createKeyPair(name);
  }

  lookupKeyPairName(): Promise<string> {
    return this.storage.get(this.key);
  }

  storeKeyPairName(name: string) {
    this.storage.set(this.key, name);
  }

  clear() {
    this.storage.remove(this.key);
  }
  
}

