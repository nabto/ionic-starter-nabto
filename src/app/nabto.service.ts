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
        nabto.rpcInvoke("nabto://demo.nabto.net/wind_speed.json?", (err, response) => {
          if (!err) {
            console.log("RPC invocation result: " + response);
            console.log("RPC invocation result: " + JSON.stringify(response));
          } else {
            reject(new Error("Invoke failed: " + error.message));
          }
        });
        let richDevices = [];
        for(let i = 0; i < deviceIds.length; i++) {
          console.log("adding device " + i + " to list: " + deviceIds[i]);
          richDevices.push(new NabtoDevice(`Sommerhus Stuen`, deviceIds[i], 'ACME 8000 Heatpump', 'img/chip.png'));
          richDevices.push(new NabtoDevice(`Sommerhus Stuen`, deviceIds[i], 'ACME 8000 Heatpump', 'http://www.heatpumps4pools.com/myfiles/image/spare-parts-image-2.jpg'));
        }
        resolve(richDevices);
        return;
      });
    });
  }
}

