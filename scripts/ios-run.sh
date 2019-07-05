#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/..

# if you get an error about missing a development team, add the following: "-- --developmentTeam=<team id>"
ionic cordova run ios --livereload -c -s --debug --device
