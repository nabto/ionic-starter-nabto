#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

ionic cordova platform add android@latest
ionic cordova prepare android
ionic cordova build android
