# Ionic Starter for Nabto IoT / AppMyProduct - 1.0 BETA

This [Ionic](http://ionicframework.com) Starter is the first [AppMyProduct](https://www.appmyproduct.com) sample app. It contains everything to build a production ready IoT app to remote control your own product:

* Device management through local discovery and bookmarks for later access
* RSA fingerprint based pairing of local devices with app for secure remote access
* On-device access control and user management (self-contained, no need for any central configuration)
* Example page for heating control to demonstrate actual device interaction - can be replaced with specific remote control for your IoT scenario
* Takes full benefit of the Nabto framework to ensure secure, high performance remote access

<p align="center">
<img border="1" src="images/overview_framed.png">
<img border="1" src="images/control_framed.png">
<img border="1" src="images/acl_framed.png">
</p>

The product specific customization takes place through `./src/pages/vendor-heating`, use this as the starting point for adapting the app to your specific domain (e.g., to control smart lock or lights). The app uses the [Nabto Cordova Plugin](https://github.com/nabto/cordova-plugin-nabto) and adds a simpler to use TypeScript and Promise based wrapper (`./src/app/nabto.service.ts`).

To try the app, follow the instructions below.

To setup a stub device to interact with (and to use as basis for your own device integration), build and run the [AppMyProduct Heat Control stub](https://github.com/nabto/appmyproduct-device-stub). To enable the device for remote access, this requires an [AppMyProduct account](https://www.appmyproduct.com).

# iOS

## Quick start

On a typical developer workstation, an app can be built with the following steps from this directory:

```console
sudo ./scripts/ios-install.sh
./scripts/ios-build.sh
./scripts/ios-emulate.sh
```

See more detailed outline below.


## Install

1. Node and NPM must be installed (either through your package manager or from [nodejs.org](https://nodejs.org/en/download/)).
2. Xcode must be installed
3. install cordova: `sudo npm install cordova -g`
4. install ionic: `sudo npm install ionic -g`
5. to enable running on device: `sudo npm install -g ios-deploy --unsafe-perm=true`
6. to enable running on simulator: `sudo npm install -g ios-sim`

Odd problems during deploy / run can sometimes apparently be remedied by uninstalling `ios-deploy` and `ios-sim` and re-installing.

## Build

Only necessary first time and when changing native plugin configuration:

```console
ionic prepare ios

# fix linker problem when using Nabto lib
echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

ionic build ios
```


## Run

The following requires the device to be connected with USB and screen must be unlocked:

```console
ionic run ios --livereload -c -s --debug --device
```

or run on in the simulator:

```console
ionic emulate ios --livereload -c -s --debug
```

Live reload is enabled, allowing you to instantly observe changes in HTML app source files (`*.ts, *.html. *.scss`). While very handy during development, this also means the app will not work on a device that is disconnected from the workstation or if the ionic server is stopped. So if you have problems with the app hanging after start, remove the `--livereload` parameter.

If an error is observed about developer/provisining profile, open the project in xcode and select a profile:

```console
open platforms/ios/AMP\ Heat.xcodeproj
```

Subsequently, the run command above can be used.


# Android

## Quick start

On a typical developer workstation, an app can be built with the following steps from this directory:

```console
sudo ./scripts/android-install.sh
./scripts/android-build.sh
./scripts/android-emulate.sh
```

Note that for the last step, an Android emulator image must have been configured with adb.

## Install

1. Node and NPM must be installed (either through your package manager or from [nodejs.org](https://nodejs.org/en/download/)).
2. Android Studio must be installed and an emulator device configured 
3. install cordova: `sudo npm install cordova -g`
4. install ionic: `sudo npm install ionic -g`

## Build

Only necessary first time and when changing native plugin configuration:

```console
ionic prepare android
ionic build android
```

## Run

The following requires the device to be connected with USB:

```console
ionic run android --livereload -c -s --debug --device
```

or run using an already configured emulator:

```console
ionic emulate android --livereload -c -s --debug
```

Live reload is enabled, allowing you to instantly observe changes in HTML app source files (`*.ts, *.html. *.scss`). While very handy during development, this also means the app will not work on a device that is disconnected from the workstation or if the ionic server is stopped. So if you have problems with the app hanging after start, remove the `--livereload` parameter.

