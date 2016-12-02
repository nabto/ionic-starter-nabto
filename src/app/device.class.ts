export class NabtoDevice {
  name: string;
  id: string;
  product: string;
  iconUrl: string;
  allowLocalAccess: boolean;
  addLocalUsers: boolean;

  // iconUrl is absolute or relative to bundle's www folder, e.g. use
  // img/mydevice.png from device and put image in www/img/mydevice.png
  constructor(name: string,
              id: string,
              product: string,
              iconUrl?: string,
              allowLocalAccess?: boolean,
              addLocalUsers?: boolean
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
    if (allowLocalAccess) {
      this.allowLocalAccess = allowLocalAccess;
    } else {
      this.allowLocalAccess = false;
    }
    if (addLocalUsers) {
      this.addLocalUsers = addLocalUsers;
    } else {
      this.addLocalUsers = false;
    }

  }
}
