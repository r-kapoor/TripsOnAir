
var verbose = false;

// executing
//--- section below can be re-used for scripts with hard-coded values // Copyright 2014 ... http://www.nodeclipse.org/

var child_process = require('child_process');
var spawn = child_process.spawn;
var isWin = /^win/.test(process.platform);
var what = isWin ? 'eclipsec' : 'eclipse'; // see [How do I run Eclipse?](https://wiki.eclipse.org/FAQ_How_do_I_run_Eclipse%3F)
//var repository = 'http://www.nodeclipse.org/updates/';
var repository = 'jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/';

var command = '-list';
//var query = '"Q:everything.select(x | x.properties ~= filter(\"(org.eclipse.equinox.p2.type.group=true)\"))"';
//var query = '"Q:everything.select(x | x.properties ~= filter(\\\"(org.eclipse.equinox.p2.type.group=true)\\\"))"';
var query = '';
var optionsList = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository, 
               '-list', query]; //enough for -list

var comma_separated_list;
var optionsInstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
               '-installIU', comma_separated_list, '-tag', comma_separated_list, '-vmargs', '-Declipse.p2.mirrors=false'];


//-- subs {
var log2console = function (data) {
	console.log(data);
}
var outputString = '';
var log2consoleAndString = function (data) {
	console.log(data);
	outputString += data;
}
var onExitShowCode = function (code) {
	console.log(what+' process exit code ' + code);
}
//var onExitShowCodeAndRetryIfMissing = function (code) { // uses comma_separated_list
//	console.log(what+' process exit code ' + code);
//	if (code===0) return;
//	// if there were "Missing requirement" string, then retry with eclipse.p2.mirrors enabled
//	if (outputString.indexOf('Missing requirement')===-1) return;
//	var tag = 'retry_all_from_'+repository;
//	optionsInstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
//	                  '-installIU', comma_separated_list, '-tag', tag];
//	// 3rd operation
//	var spawned = spawning(what, optionsInstall, log2consoleAndString, onExitShowCode);
//}
var onExitShowCodeAndContinue = function (code) {
	console.log(what+' process exit code ' + code);
	if (verbose) console.log(outputString);
	var array = outputString.split("\n");
	var filtered = array.filter( function(s){return s.indexOf('feature.group')!==-1;} );
	console.log(filtered);
	if (code!=0) return;
	
	comma_separated_list = '';
	for (var i=0; i<filtered.length; i++){
		var feature = filtered[i].replace('=', '/').replace('\r', '');
		comma_separated_list += feature+',';
	}
	// delete last comma
	comma_separated_list = comma_separated_list.substring(0, comma_separated_list.length-1);
	var tag = 'all_from_'+repository;
	optionsInstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
	                      '-installIU', comma_separated_list, '-tag', tag, '-vmargs', '-Declipse.p2.mirrors=false'];
	
	////spawn 3 times : list, then install, then retry install if missing
	// retry fails as with eclipse.p2.mirrors -repository has no affect and listed IU can't be found
	//var spawned = spawning(what, optionsInstall, log2consoleAndString, onExitShowCodeAndRetryIfMissing);
	//continueSecondOperation();
	var spawned = spawning(what, optionsInstall, log2console, onExitShowCode);
}
var spawning = function (what, options, dataHandler, closeHandler) {
	var spawned = spawn(what, options);
	console.log('starting '+what+' '+options.join(' '));
	spawned.stdout.setEncoding('utf8');
	spawned.stdout.on('data', dataHandler);
	spawned.stderr.setEncoding('utf8');
	spawned.stderr.on('data', dataHandler);
	spawned.on('close', closeHandler);
	return spawned;
}
//-- }

var spawned = spawning(what, optionsList, log2consoleAndString, onExitShowCodeAndContinue);


//var continueSecondOperation  = function (){
//	var spawned = spawning(what, optionsInstall, log2consoleAndString, onExitShowCode);
//} 

//starting eclipsec -nosplash -application org.eclipse.equinox.p2.director -list -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ "Q:everything.select(x | x.properties ~= filter("(org.eclipse.equinox.p2.type.group=true)"))"
//Installation failed.
//
//Unknown option "Q:everything.select(x | x.properties ~= filter("(org.eclipse.equinox.p2.type.group=true)"))". Use -help for a list of known options.


//-- old code:
/*
var spawned = spawn(what, options);

//console.log('starting '+what+' '+JSON.stringify(options));
//console.log('starting '+what+' '+options.toString());
console.log('starting '+what+' '+options.join(' '));

spawned.stdout.setEncoding('utf8');
spawned.stdout.on('data', function (data) {
    console.log(data);
});
spawned.stderr.setEncoding('utf8');
spawned.stderr.on('data', function (data) {
    console.log(data);
});

spawned.on('close', function (code) {
    console.log(what+' process exit code ' + code);
});
*/


