#!/usr/bin/env node
// #101; this file should have UNIX style line endings (\n only) when publishing

/* what module to use? */

var path = require('path');
var fs   = require('fs');

var argv = process.argv; // 0 - node, 1 - app.js
//`===` does not compare strings well 
if (argv[2]=='help') argv[2]='--help'; // to make it visible to optimist (don't like it)

if ( argv[2]=='install' || argv[2]=='i' //install
		|| argv[2]=='list' //list repository
		|| argv[2]=='materialize' || argv[2]=='new'	|| argv[2]=='uninstall' || argv[2]=='update'
		|| ( argv[2]=='help' || argv[2]=='--help' || argv[2]=='-h') 
			&& (argv[3]=='aliases' || argv[3]=='install' || argv[3]=='list' 
				|| argv[3]=='materialize' || argv[2]=='new'	|| argv[2]=='uninstall' || argv[2]=='update') ) // help on nci,epm
{  
	var installerjs  = path.join(path.dirname(fs.realpathSync(__filename)), '../nodeclipse-install.js');
	var c = require(installerjs);
} else{
	var copierjs  = path.join(path.dirname(fs.realpathSync(__filename)), '../copier.js');
	var c = require(copierjs);
}
