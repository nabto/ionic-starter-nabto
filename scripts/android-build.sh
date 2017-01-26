#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

ionic platform add android@6.1.1
ionic prepare android
ionic build android
