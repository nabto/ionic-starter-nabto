#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -e

. $DIR/common-install.sh

npm install -g ios-sim@latest
npm install -g ios-deploy --unsafe-perm=true
