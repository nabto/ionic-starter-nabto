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

  public hasRemoteAccess() {
    return ((this.permissions & FP_ACL_PERMISSION_REMOTE_ACCESS) == FP_ACL_PERMISSION_REMOTE_ACCESS);
  }

  public setRemoteAccessPermission(granted: boolean) {
    if (granted) {
      this.permissions = this.permissions | FP_ACL_PERMISSION_REMOTE_ACCESS;
    } else {
      this.permissions = this.permissions & ~FP_ACL_PERMISSION_REMOTE_ACCESS;
    }
  }

  public role() {
    return this.isOwner() ? "Owner" : "Guest";
  }

  public icon() {
    return this.isOwner() ? "contact" : "people";
  }

  public niceFingerprint() {
    return this.fingerprint.replace(/(.{2}(?=.))/g,"$1:");
  }
  
  public niceAccessString() {
    if (this.hasRemoteAccess()) {
      return "local & remote access";
    } else {
      return "local access only";
    }
  }
}

export class NabtoDevice {
  public reachable: boolean;
  public id: string;
  public name: string;
  public product: string;
  public description: string;
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
              iconName: string,
              description: string,
              openForPairing: boolean,
              currentUserIsPaired: boolean,
              currentUserIsOwner: boolean,
             )   
  {    
    this.reachable = true;
    this.name = name;
    this.id = id;
    this.product = product;
    this.description = description;
    if (iconName) {
      this.iconUrl = 'assets/img/' + iconName;
    } else {
      this.iconUrl = 'assets/img/chip.png';
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

  setUnsupported() {
    this.description = `${this.product} unsupported by this app`;
    this.reachable = false;
    this.setUnknownIcon();
  }

  setUnknownIcon() {
    this.iconUrl = "assets/img/unknown.png";
  }

  setDescription(desc: string) {
    this.description = desc;
  }

  setOffline() {
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
