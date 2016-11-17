#!/bin/bash

which ionic > /dev/null

if [ $? != "0" ]; then
    echo sudo npm install -g ionic
fi

# npm hook workaround for nabto-1347 does apparently not work with cordova as 
# it fails before downloading, so manually download here

echo "Installing Nabto libraries (work around for NABTO-1347)"

SDKS=nabto-sdk-ios-3.0.15-beta1.tar.gz

for f in ${SDKS}; do
    tmp=`mktemp`
    url=https://download.nabto.com/npm-libs/$f
    curl -# $url > $tmp
    if [ $? != "0" ]; then
       echo "FATAL: Download of $url failed."
       rm -f $tmp
       exit 1
    fi
    cd src
    tar xvfz $tmp
    rm -f $tmp
done

set -e

npm install
#ionic platform add ios browser
#ionic plugin add cordova-plugin-nabto --searchpath=/Users/nabto/git/cordova-plugin-nabto --verbose
#ionic plugin add cordova-plugin-nabto@2.0-beta.3
echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig

ionic state restore
