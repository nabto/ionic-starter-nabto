#!/bin/bash

cordova plugin remove cordova-plugin-nabto
cordova plugin add cordova-plugin-nabto@2.0.0-beta.7 --searchpath ~/git/cordova-plugin-nabto

echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

ionic build
