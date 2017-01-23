# Ionic Starter for Nabto IoT / AppMyProduct - 1.0 BETA

This [Ionic](http://ionicframework.com) Starter is the first [AppMyProduct](https://www.appmyproduct.com) sample app. It contains everything to build a production ready IoT app to remote control your own product:

* Device management through local discovery and bookmarks for later access
* RSA fingerprint based pairing of local devices with app for secure remote access
* Access control and user management
* Example page for heating control to demonstrate actual device interaction - can be replaced with specific remote control for your IoT scenario
* Takes full benefit of the Nabto framework to ensure secure, high performance remote access

<p align="center">
<img border="1" src="images/overview_framed.png">
<img border="1" src="images/control_framed.png">
<img border="1" src="images/acl_framed.png">
</p>

The product specific customization takes place through `./src/pages/vendor-heating`, use this as the starting point for adapting the app to your specific domain (e.g., to control smart lock or lights).

To try the app, follow the instructions below.

To setup a stub device to interact with (and to use as basis for your own device integration), build and run the [AppMyProduct Heat Control stub](https://github.com/nabto/appmyproduct-device-stub). To enable the device for remote access, this requires an [AppMyProduct account](https://www.appmyproduct.com).

## Ultra quick start on iOS

```
npm install cordova ionic ios-sim -g
ionic prepare
echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig
ionic build
ionic emulate ios --livereload -c -s --debug
```

## Prerequisites:

For Android apps: Android Studio must be installed

For iOS apps: Xcode must be installed

## Installation (all platforms):

1. install cordova: sudo npm install cordova -g

2. install ionic: sudo npm install ionic -g

3. npm install

Note the very old version of ionic above, the project will be updated to newest version once it is verified to work ok (many quirks observed so far with 2.1.9+).

## iOS

### iOS specific prerequisites

1. to enable running on device: sudo npm install -g ios-deploy --unsafe-perm=true

2. to enable running on simulator: sudo npm install -g ios-sim

Odd problems during deploy / run can sometimes apparently be remedied by uninstalling the above and re-installing.

### Building on iOS

Only necessary first time and when changing native plugin configuration.

1. ionic prepare ios

2. fix linker problem when using Nabto lib: `echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig`

3. ionic build ios

### Running on iOS

The following requires the device to be connected with USB and screen must be unlocked:

```ionic run ios --livereload -c -s --debug --device```

Live reload is enabled, allowing you to instantly observe changes in source files.

If an error is observed about developer/provisining profile, open the project in xcode and select a profile:

```open platforms/ios/AMP\ Heat.xcodeproj```

Subsequently, the run command above can be used.

### Running on iOS simulator

```ionic emulate ios --livereload -c -s --debug```


### Android

1. ionic platform add android

2. ionic prepare android

3. ionic build android

4. ionic run android --livereload -c -s --debug --device

ionic emulate on android requires preparing emulator, notes will follow on this.

