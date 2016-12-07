export class NabtoDevice {
  name: string;
  id: string;
  product: string;
  iconUrl: string;
  paired: boolean;
  openForPairing: boolean;
  
  allowLocalAccess: boolean;
  addLocalUsers: boolean;

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
              paired?: boolean,
              pairingMode?: number
             )   
  {
    this.name = name;
    this.id = id;
    this.product = product;
    this.iconUrl = iconUrl;
    if (iconUrl) {
      this.iconUrl = iconUrl;
    } else {
      this.iconUrl = 'img/chip.png';
    }
    if (paired) {
      this.paired = paired;
    } else {
      this.paired = false;
    }
    this.openForPairing = (pairingMode && pairingMode == 1);
  }
}
