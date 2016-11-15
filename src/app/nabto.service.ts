import { Injectable } from '@angular/core';

declare var nabto;
declare var NabtoError;

export class NabtoDevice {
  name: string;
  id: string;
  product: string;
  iconUrl: string;

  // iconUrl is absolute or relative to bundle's www folder, e.g. use
  // img/mydevice.png from device and put image in www/img/mydevice.png
  constructor(name: string,
              id: string,
              product: string,
              iconUrl: string)   
  {
    this.name = name;
    this.id = id;
    this.product = product;
    this.iconUrl = iconUrl;
  }
}

@Injectable()
export class NabtoService {

  discover(): Promise<NabtoDevice[]> {
    return new Promise((resolve, reject) => {
      nabto.getLocalDevices((error: any, deviceIds: any) => {
        if (error) {
          reject(new Error("Discover failed: " + error.message));
          return;
        }
        let devices = [];
        for(let i = 0; i < deviceIds.length; i++) {
          devices.push(this.getDetails(deviceIds[i]));
        }
        Promise.all(devices).then((res: NabtoDevice[]) => {
          for(let i = 0; i < res.length; i++) {
            console.log(`got devices ${i}: ${res[i].id}, ${res[i].iconUrl}, ${res[i].product}, ${res[i].name}`);
            resolve(res);
          }
        });
      });
    });
  }

  
  getDetails(deviceId: string): Promise<NabtoDevice> {
    return new Promise((resolve, reject) => {
      nabto.rpcInvoke("nabto://" + deviceId + "/getPublicDeviceInfo.json?", (err, details) => {
        if (!err) {
          let r = details.response;
          let dev:NabtoDevice = new NabtoDevice(r.deviceName, deviceId, r.deviceType, r.deviceIcon);
          console.log("resolving promise with public info from RPC: " + JSON.stringify(dev));
          resolve(dev);
        } else {
          console.error(`public info could not be retrieved for ${deviceId}: ${JSON.stringify(err)}`);
          resolve(new NabtoDevice(deviceId, deviceId, "(could not get details)", details.deviceIcon));
        }
      });
    });
  }

  
}

