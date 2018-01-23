#!/bin/bash

set -e

if [ "$EUID" != "0" ]; then
    echo "Please run as root if installation fails below with ENOACCESS (sudo $0)."
fi

cordova > /dev/null 2>&1
if [ $? != 0 ]; then 
  # install old cordova as versions 7+ is observed to have problems installing iOS platform
  # (problem similar to the one described here: https://github.com/mapsplugin/cordova-plugin-googlemaps/issues/1435)
  npm install -g cordova@6.5.0 
else 
  # cordova already installed but npm chokes with odd errors about missing .DELETE files if trying to install again
  echo Cordova already installed
fi

npm install -g ionic
