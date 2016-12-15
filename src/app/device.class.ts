export class NabtoDevice {
  public name: string;
  public id: string;
  public product: string;
  public iconUrl: string;
  public openForPairing: boolean;
  public remoteAccessEnabled: boolean = true;
  public grantGuestRemoteAccess: boolean;
  public currentUserIsOwner: boolean;
  
  accessIcon(): string {
    if (this.openForPairing) {
      return "unlock";
    } else {
      return "lock";
    }
  }
  
  // iconUrl is absolute or relative to bundle's www folder, e.g. use
  // img/mydevice.png from device and put image in www/img/mydevice.png
  constructor(name: string,
              id: string,
              product: string,
              iconUrl?: string,
              currentUserIsOwner?: boolean,
              pairingMode?: number,
              remoteAccessEnabled?: boolean,
              grantGuestRemoteAccess?: boolean
             )   
  {
    this.remoteAccessEnabled = true;// || !!remoteAccessEnabled;
    this.grantGuestRemoteAccess = !!grantGuestRemoteAccess;
    
    this.name = name;
    this.id = id;
    this.product = product;
    this.iconUrl = iconUrl;
    if (iconUrl) {
      this.iconUrl = iconUrl;
    } else {
      this.iconUrl = 'img/chip.png';
    }
    this.currentUserIsOwner = !!currentUserIsOwner;
    this.openForPairing = (!!pairingMode && pairingMode == 1);
    this.remoteAccessEnabled = !!remoteAccessEnabled;
    this.grantGuestRemoteAccess = !!grantGuestRemoteAccess;
    console.log(`this.currentUserIsOwner=${this.currentUserIsOwner}, currentUserIsOwner=${currentUserIsOwner}`);
  }
}
