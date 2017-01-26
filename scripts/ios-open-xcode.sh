#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

PROJ=`find platforms -name "*xcodeproj" | grep -v CordovaLib`

if [ -n "$PROJ" ]; then
    ionic prepare ios
    open "$PROJ"
else
    echo "Could not find XCode project - did you add the ios platform (ionic platform add ios)?"
    exit 1
fi
