#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

# see available simulators with cordova emulate ios --list, then invoke with --target "iPhone-7, 10.3"
ionic cordova emulate ios -l -c --target iPhone-8 
