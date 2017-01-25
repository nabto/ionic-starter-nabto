#!/bin/bash

set -e

if [ "$EUID" != "0" ]; then
    echo "Please run as root (sudo $0)."
    exit 1
fi

npm install cordova ionic -g
