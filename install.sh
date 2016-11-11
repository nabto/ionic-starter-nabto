ionic plugin add cordova-plugin-nabto --searchpath=/Users/nabto/git/cordova-plugin-nabto --verbose
echo "OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++" >> platforms/ios/cordova/build.xcconfig

