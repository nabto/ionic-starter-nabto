export class NabtoDevice {
  name: string;
  id: string;
  product: string;
  iconUrl: string;
  openOnLan: boolean;

  // iconUrl is absolute or relative to bundle's www folder, e.g. use
  // img/mydevice.png from device and put image in www/img/mydevice.png
  constructor(name: string,
              id: string,
              product: string,
              iconUrl?: string,
              openOnLan?: boolean
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
    if (openOnLan) {
      this.openOnLan = openOnLan;
    } else
      this.openOnLan = false;
  }
}
