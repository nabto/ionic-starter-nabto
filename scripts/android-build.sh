#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

if [ ! -d node_modules ]; then
    npm install
fi

ionic cordova platform add android
#ionic cordova platform add android@latest
ionic cordova prepare android
ionic cordova build android
