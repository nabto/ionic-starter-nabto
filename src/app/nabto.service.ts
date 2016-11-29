import { Injectable } from '@angular/core';
import { NabtoDevice } from './device.class';
import { Storage } from '@ionic/storage';
import { Http, Response } from '@angular/http';

declare var nabto;
declare var NabtoError;

@Injectable()
export class NabtoService {

  constructor (private storage: Storage,
               private http: Http) {
  }

  //
  // NOTE: Keypair is stored directly on the filesystem with dummy
  // encryption (common password) - if necessary, encrypt with either
  // user provided password (more complex user experience) or protect
  // with a random password (e.g. through window.crypto.getRandomValues)
  // which is then stored in the platform's keystore.
  //
  // A Cordova plugin for accessing the native platform's secure
  // storage to store and retrieve such generated random password is
  // available at https://github.com/Crypho/cordova-plugin-secure-storage.
  //
  // However, please note that this approach only works well on iOS -
  // on Android, the keystore is completely nuked when the user
  // changes security settings as outlined here:
  // https://doridori.github.io/android-security-the-forgetful-keystore/
  //
  // The consequences must be carefully explained to the user - hence
  // per default, we have not enabled this.
  //
  public createKeyPair(username: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let password = "empty"; // see comment above
      nabto.createKeyPair(username, password, (error) => {
        if (!error) {
          console.log("nabto.createKeyPair succeeded");
          this.storage.set('username', username);    
          resolve(username)
        } else {
          console.log(`nabto.createKeyPair failed: ${error} (code=${error.code}, inner=${error.inner})`);
          reject(error);
        }
      });
    });
  }
  /*
	public startup(): Promise<string> {
    return new Promise((resolve, reject) => {
    this.storage.get('username').then((username) => {
    // resolve if keystore.has(username) && nabtoStartup && nabtoOpensession(username)
    resolve("TODO - username");
    });
    });
    }*/

  public startup(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      nabto.startup(() => {
        this.http.get("nabto/unabto_queries.xml")
          .toPromise()
          .then((res: Response) => {
            nabto.rpcSetDefaultInterface(res.text(), (err: any) => {
              if (!err) {
                console.log("nabto started and interface set ok!")
                resolve();
              } else {
                console.log(JSON.stringify(err));
                reject(new Error("Could not inject device interface definition - please contact app vendor" + err.message));
              }
            })
          })
          .catch((err) => {
            console.log(err);
            reject(new Error("Could not load device interface definition - please contact app vendor: " + err));
          });
      });
    });
  }
  
  public discover(): Promise<NabtoDevice[]> {
    return new Promise((resolve, reject) => {
      nabto.getLocalDevices((error: any, deviceIds: any) => {
        if (error) {
          console.log("getLocalDevices() failed: " + error);
          reject(new Error("Discover failed: " + error.message));
          return;
        }
		this.prepareInvoke(deviceIds).then(() => {
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
          resolve(new NabtoDevice(deviceId, deviceId, "(could not get details)"));
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

  public prepareInvoke(devices: NabtoDevice[]): Promise<void> {
	return new Promise((resolve,reject) => {
	  nabto.prepareInvoke(devices, (error) => {
		if(error){
		  reject(new Error("PrepareConnect failed: " + error.message));
		  return
		}
		resolve();
	  });
	});
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
                if (err.code == NabtoError.Code.API_CONNECT_TIMEOUT) {
                  // work around for NABTO-1330: if ec 1000026 follows after 2000058 it usually is because of target device has gone offline in between two invocations
                  err.code = NabtoError.Code.API_RPC_DEVICE_OFFLINE;
                }
                reject(err);
              }
            });
          } else {
            reject(err);
          }
        }
      });
    });
  }  
}


