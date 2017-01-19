# Ionic Starter for Nabto / AppMyProduct

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

