#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

if [ ! -d node_modules ]; then
    npm install
fi

ionic cordova platform add ios
#ionic cordova platform add ios@latest

if [ -e platforms/ios/cordova ]; then

  # work around for often seen problem when running emulator as of June 2017 (and it must be done in this odd way, even with previous installation using -g):
  # https://stackoverflow.com/questions/42350505/error-cannot-read-property-replace-of-undefined-when-building-ios-cordova
  (cd platforms/ios/cordova && npm install ios-sim@latest)

  ionic cordova prepare ios

  # fix linker problem when using Nabto lib
  echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

  ionic cordova build ios

fi
