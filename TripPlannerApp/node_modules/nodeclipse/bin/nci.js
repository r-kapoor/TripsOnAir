#!/usr/bin/env node
// #101; this file should have UNIX style line endings (\n only) when publishing

/* what module to use? */

var path = require('path');
var fs   = require('fs');

var installerjs  = path.join(path.dirname(fs.realpathSync(__filename)), '../nodeclipse-install.js');
var c = require(installerjs);
