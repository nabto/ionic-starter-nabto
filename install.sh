#!/bin/bash

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm -g install ionic cordova
npm install

# super ugly hen-and-egg workaround for nabto-1347: cordova plugin
# fails installation because nabto lib files are missing, if nabto lib
# files are installed, newer cordova versions fail because they
# recognize the semi-empty plugin dir as a failed plugin. So workaround is:
#
# 1) install plugin and fail (to setup correct file structure)
#
# 2) install lib files
#
# 3) install plugin again

# step 1 - fail
ionic plugin add cordova-plugin-nabto@2.0-beta.4 2>&1 > /dev/null

# step 2
echo "Installing Nabto libraries (work around for NABTO-1347)"

DIR=plugins/cordova-plugin-nabto/src
mkdir -p $DIR
cd $DIR
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
    tar xvfz $tmp
    rm -f $tmp
done

cd $ROOT

# step 3 - repeat 
ionic plugin add cordova-plugin-nabto@2.0-beta.4

ionic platform add ios 
echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> platforms/ios/cordova/build.xcconfig
