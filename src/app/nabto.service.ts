import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';

declare var nabto;
declare var NabtoError;

@Injectable()
export class NabtoService {
   
  public discover(): Promise<NabtoDevice[]> {
    return new Promise((resolve, reject) => {
      nabto.getLocalDevices((error: any, deviceIds: any) => {
        if (error) {
          reject(new Error("Discover failed: " + error.message));
          return;
        }
        let devices = [];
        for(let i = 0; i < deviceIds.length; i++) {
          devices.push(this.getPublicDetails(deviceIds[i]));
        }
        Promise.all(devices).then((res: NabtoDevice[]) => {
          for(let i = 0; i < res.length; i++) {
            console.log(`got devices ${i}: ${res[i].id}, ${res[i].iconUrl}, ${res[i].product}, ${res[i].name}`);
          }
          resolve(res);
        });
      });
    });
  }
  
  private getPublicDetails(deviceId: string): Promise<NabtoDevice> {
    return new Promise((resolve, reject) => {
      nabto.rpcInvoke("nabto://" + deviceId + "/get_public_device_info.json?", (err, details) => {
        if (!err) {
          let r = details.response;
          let dev:NabtoDevice = new NabtoDevice(r.device_name, deviceId, r.device_type, r.device_icon);
          console.log("resolving promise with public info from RPC: " + JSON.stringify(dev));
          resolve(dev);
        } else {
          console.error(`public info could not be retrieved for ${deviceId}: ${JSON.stringify(err)}`);
          resolve(new NabtoDevice(deviceId, deviceId, "(could not get details)", details.deviceIcon));
        }
      });
    });
  }

  private buildParamString(input: any): string {
    let params = [];
    for (let key in input) {
        if (input.hasOwnProperty(key)) {
            let val = input[key];
            params.push(`${key}=${val}`);
        }
    }
    return params.join("&");
  }

  private doReject(reject: any, err: any) {
    let msg;
    if (err.message) {
      msg = err.message;
    } else {
      msg = "Request failed";
    }
    reject(new Error(msg));
  }
  
  public invokeRpc(device: NabtoDevice, request: string, parameters?: any): Promise<NabtoDevice> {
    return new Promise((resolve, reject) => {
      let paramString = "";
      if (parameters) {
          paramString = this.buildParamString(parameters);
      }
      nabto.rpcInvoke(`nabto://${device.id}/${request}?${paramString}`, (err, res) => {
        if (!err) {
          resolve(res.response);
        } else {
          if (err.code == NabtoError.Code.API_RPC_COMMUNICATION_PROBLEM) {
            // retry on this specific error (API will have flushed connection and re-connect)
            nabto.rpcInvoke(`nabto://${device.id}/${request}?${paramString}`, (err, res) => {
              if (!err) {
                resolve(res.response);
              } else {
                this.doReject(reject, err);
              }
            });
          } else {
            this.doReject(reject, err);
          }
        }
      });
    });
  }  
}


