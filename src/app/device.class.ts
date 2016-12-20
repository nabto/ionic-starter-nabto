let FP_ACL_PERMISSION_LOCAL_ACCESS          = 0x80000000;
let FP_ACL_PERMISSION_REMOTE_ACCESS         = 0x40000000;
let FP_ACL_PERMISSION_ADMIN                 = 0x20000000;
let FP_ACL_SYSTEM_PERMISSION_LOCAL_ACCESS   = 0x80000000;
let FP_ACL_SYSTEM_PERMISSION_REMOTE_ACCESS  = 0x40000000;
let FP_ACL_SYSTEM_PERMISSION_PAIRING        = 0x20000000;

export class DeviceUser {
  public fingerprint: string;
  public name: string;
  public permissions: number;
  
  constructor(object: any) {
    this.fingerprint = object.fingerprint;
    this.name = object.name;
    this.permissions = object.permissions;
  }

  public isOwner() {
    return ((this.permissions & FP_ACL_PERMISSION_ADMIN) == FP_ACL_PERMISSION_ADMIN);
  }
}

export class NabtoDevice {
  public reachable: boolean;
  public id: string;
  public name: string;
  public product: string;
  public iconUrl: string;
  public openForPairing: boolean = false;
  public remoteAccessEnabled: boolean = false;
  public grantGuestRemoteAccess: boolean = false;
  public currentUserIsPaired: boolean = false;
  public currentUserIsOwner: boolean = false;

   // iconUrl is absolute or relative to bundle's www folder, e.g. use
  // img/mydevice.png from device and put image in www/img/mydevice.png
  constructor(name: string,
              id: string,
              product: string,
              iconUrl: string,
              openForPairing: boolean,
              currentUserIsPaired: boolean,
              currentUserIsOwner: boolean,
             )   
  {    
    this.reachable = true;
    this.name = name;
    this.id = id;
    this.product = product;
    if (iconUrl) {
      this.iconUrl = iconUrl;
    } else {
      this.iconUrl = 'img/chip.png';
    }
    this.openForPairing = openForPairing;
    this.currentUserIsPaired = currentUserIsPaired;
    this.currentUserIsOwner = currentUserIsOwner;
  }  

  accessIcon(): string {
    if (this.openForPairing) {
      return "unlock";
    } else {
      return "lock";
    }
  }

  setOffline() {
    this.name = this.name + " (unavailable)";
    this.reachable = false;
  }

  setSystemSecurityDetails(system: any) {
    this.remoteAccessEnabled = ((system.permissions & FP_ACL_SYSTEM_PERMISSION_REMOTE_ACCESS) ==
                                  FP_ACL_SYSTEM_PERMISSION_REMOTE_ACCESS);
    this.openForPairing = ((system.permissions & FP_ACL_SYSTEM_PERMISSION_PAIRING) ==
                             FP_ACL_SYSTEM_PERMISSION_PAIRING);
    this.grantGuestRemoteAccess = ((system.default_user_permissions_after_pairing & FP_ACL_PERMISSION_REMOTE_ACCESS) ==
                                   FP_ACL_PERMISSION_REMOTE_ACCESS);
  }

  getSystemPermissions(): number {
    return FP_ACL_SYSTEM_PERMISSION_LOCAL_ACCESS |
      (this.remoteAccessEnabled ? FP_ACL_SYSTEM_PERMISSION_REMOTE_ACCESS : 0) |
      (this.openForPairing ? FP_ACL_SYSTEM_PERMISSION_PAIRING : 0);
  }

  getDefaultUserPermissions(): number {
    if (this.grantGuestRemoteAccess) {
      return FP_ACL_PERMISSION_REMOTE_ACCESS | FP_ACL_PERMISSION_LOCAL_ACCESS;
    } else {
      return FP_ACL_PERMISSION_LOCAL_ACCESS;
    }
  }
  
}
