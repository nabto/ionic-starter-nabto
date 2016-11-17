#!/bin/bash

set -e

npm install
ionic platform add ios browser
#ionic plugin add cordova-plugin-nabto --searchpath=/Users/nabto/git/cordova-plugin-nabto --verbose
ionic plugin add cordova-plugin-nabto@2.0-beta.2
echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

