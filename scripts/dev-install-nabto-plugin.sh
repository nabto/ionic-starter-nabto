#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

CDV_PLUGIN_TAG=@2.0.4
CDV_LOCAL_GIT=${DIR}/../../cordova-plugin-nabto

cordova plugin remove cordova-plugin-nabto
cordova plugin add cordova-plugin-nabto${CDV_PLUGIN_TAG} --searchpath ${CDV_LOCAL_GIT}

echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

ionic build
