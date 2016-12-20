#!/bin/bash

set -e

ionic prepare ios
# ionic run ios
open platforms/ios/ionic-starter-nabto.xcodeproj
