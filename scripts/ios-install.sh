#!/bin/bash

set -e

if [ "$EUID" != "0" ]; then
    echo "Please run as root (sudo $0)."
    exit 1
fi

npm install cordova ionic ios-sim@latest -g
npm install -g ios-deploy --unsafe-perm=true
