# Ionic Starter for Nabto / AppMyProduct

## Prerequisites:

For Android apps: Android Studio must be installed

For iOS apps: Xcode must be installed

## Installation (all platforms):

1. install cordova: sudo npm install cordova@6.1.0 -g

2. install ionic: sudo npm install ionic@2.1.8 -g

3. npm install

Note the very old version of ionic above, the project will be updated to newest version once it is verified to work ok (many quirks observed so far with 2.1.9+).

### iOS

1. ionic prepare

2. echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

3. ionic build

4. ionic emulate ios 

ionic run is broken on ios as of writing, to run on device, open xcodeproject in platforms/ios.

### Android

1. ionic platform add android

2. ionic prepare

3. ionic build

4. ionic run android

ionic emulate on android requires preparing emulator, notes will follow on this.

