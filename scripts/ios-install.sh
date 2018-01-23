#!/bin/bash

set -e

if [ "$EUID" != "0" ]; then
    echo "Please run as root (sudo $0)."
    exit 1
fi

# old cordova installed as versions 7+ is observed to have problems installing iOS platform
# (problem similar to the one described here: https://github.com/mapsplugin/cordova-plugin-googlemaps/issues/1435)
npm install cordova@6.5.0 ionic ios-sim@latest -g
npm install -g ios-deploy --unsafe-perm=true
