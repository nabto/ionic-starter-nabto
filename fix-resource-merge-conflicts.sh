#!/bin/bash

set -e

FILES=`find resources -name "*png" -or -name "*png.md5"`
git checkout --ours $FILES
git add $FILES

echo "Now commit changes"
