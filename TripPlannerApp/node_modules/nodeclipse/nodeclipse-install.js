/* 
 * Nodeclipse CLI Installer, Copyright 2014 Paul Verest within Nodeclipse, MIT license http://www.nodeclipse.org/
 * All well-known open source licenses http://choosealicense.com/licenses/ 
 * require showing license and copyright notice from author
 */
/*
The Eclipse runtime options
 http://help.eclipse.org/indigo/index.jsp?topic=%2Forg.eclipse.platform.doc.isv%2Freference%2Fmisc%2Fruntime-options.html
 ! but not in kepler Help as "Platform Plug-in Developer Guide" is missing
 http://help.eclipse.org/kepler/index.jsp?topic=%2Forg.eclipse.platform.doc.isv%2Freference%2Fmisc%2Fruntime-options.html
using p2 director
 https://wiki.eclipse.org/Equinox/p2/Director_application
 http://help.eclipse.org/indigo/index.jsp?topic=%2Forg.eclipse.platform.doc.isv%2Fguide%2Fp2_director.html
 https://wiki.eclipse.org/Equinox_p2_director_application/Examples/Install_into_eclipse_using_SDKProfile

<targetProductFolder>/eclipsec.exe 
   -application org.eclipse.equinox.p2.director 
   -repository http://download.eclipse.org/releases/helios/
   -installIU org.eclipse.cdt.feature.group/<version>

Arguments Description 
    -application org.eclipse.equinox.p2.director: the application ID.
    -metadataRepository: a comma separated list of metadata repository URLs where the software to be installed can be found.
    -artifactRepository: a comma separated list of artifact repository URLs where the software artifacts can be found.
    -repository: a comma separated list of repository URL where each entry denotes colocated meta-data and artifact repositories.
    -installIU: a comma separated list of IUs to install. Each entry in the list is in the form <id> [ '/' <version> ]. If you are looking to install a feature, the identifier of the feature has to be suffixed with ".feature.group".
    -uninstallIU: a comma separated list of IUs to uninstall. Each entry in the list is in the form <id> [ '/' <version> ].
    -revert: Revert the installation to a previous state. The previous state can either be a tag (see -tag / -listtags) or a previous profile state [ the number representing the previous state of the profile as found in p2/org.eclipse.equinox.p2.engine/<profileId>/ ].
    -purgeHistory: Remove the history of the profile registry.
    -destination: the path of a folder in which the targeted product is located.
    -list: lists all IU's found in the given repositories in a property like format. The optional arguments can be an comma separated list of entries where each entry is in the form <id> [ '/' <version> ], or a p2 QL query prefixed with Q:, or Q:group as shortcut for groups.
    -listTags: list all the tags found for the given profile.
    -listInstalledRoots: list all the roots IUs found in the given profile. Each entry is the list in the form id / version
    -profile: the profile id containing the description of the targeted product. This ID is is defined by the eclipse.p2.profile property contained in the config.ini of the targeted product. For the Eclipse SDK the ID is "SDKProfile"
    -profileProperties: a comma separated list of <key>=<value> pair. The property org.eclipse.update.install.features=true will cause the update manager features to be installed.
    -bundlepool: the location of where the plug-ins and features will be stored. This value is only taken into account when a new profile is created. For an application where all the bundles are located into the plugins/ folder of the destination, set it to <destination>.
    -p2.os: the OS to use when the profile is created. This will be used to filter which OS specific installable units need to be installed.
    -p2.ws: the windowing system to use when the profile is created. This will be used to filter which WS specific installable units need to be installed.
    -p2.arch: the architecture to use when the profile is created. This will be used to filter which architecture specific installable units need to be installed.
    -roaming: indicates that the product resulting from the installation can be moved. This property only makes sense when the destination and bundle pool are in the same location. This value is only taken into account when the profile is created.
    -shared: use a shared location for the install. The path defaults to ${user.home}/.p2.
    -tag: a label. This allows to tag the profile state resulting from the operation being executed.
    -verifyOnly: only verify that the actions can be performed. Don't actually install or remove anything.
While doing these operations, you can disable the automatic mirror selection mechanism by setting the VM argument eclipse.p2.mirrors to false.

eclipsec -application org.eclipse.equinox.p2.director -repository http://www.nodeclipse.org/updates/ -list
OK

http://www.vijayp.ca/blog/2011/09/why-eclipses-check-for-updates-is-horribly-slow-and-how-to-fix-it/
 Add it after “eclipse”, or in eclipse.ini
-Declipse.p2.mirrors=false

org.nodeclipse.jjs.feature.feature.group[/0.10.0.201401270634]
Succeeded with 
eclipsec -application org.eclipse.equinox.p2.director -repository http://www.nodeclipse.org/updates/ -installIU org.nodeclipse.jjs.feature.feature.group/0.10.0.201401270634 -vmargs -Declipse.p2.mirrors=false 
-> http://stackoverflow.com/questions/21574010/eclipse-how-to-pass-vm-arguments-from-command-line-without-changing-eclipse-i

eclipsec -application org.eclipse.equinox.p2.director -repository http://www.nodeclipse.org/updates/ -installIU org.nodeclipse.jjs.feature.feature.group/0.10.0.201401270634 -tag org.nodeclipse.jjs.feature.feature.group/0.10.0.201401270634 -vmargs -Declipse.p2.mirrors=false 
-> -tag works!

eclipsec -application org.eclipse.equinox.p2.director -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ -installIU org.nodeclipse.jjs.feature.feature.group -vmargs -Declipse.p2.mirrors=false
-> file URL works!
nodeclipse list jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/
-> Operation completed in 1528 ms.

eclipsec -nosplash -application org.eclipse.equinox.p2.director -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ -installIU org.nodeclipse.enide.maven.feature.feature.group -tag org.nodeclipse.enide.maven.feature.feature.jar,org.nodeclipse.enide.maven.feature.feature.group -vmargs -Declipse.p2.mirrors=false
eclipsec -nosplash -application org.eclipse.equinox.p2.director -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ -installIU org.nodeclipse.enide.maven.feature.feature.group -tag org.nodeclipse.enide.maven.feature.feature.group -vmargs -Declipse.p2.mirrors=false
nodeclipse install -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ maven
all 3 OK

nodeclipse install -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ maven gradle
OK in ADT, but not in STS 3.4

From http://stackoverflow.com/questions/19651482/how-to-install-all-features-from-a-p2-update-site-to-an-eclipse-using-the-comman
eclipsec.exe -application org.eclipse.equinox.p2.director \
   -repository <URL of some repository> \
   -list "Q:everything.select(x | x.properties ~= filter(\"(org.eclipse.equinox.p2.type.group=true)\"))"

eclipsec.exe -nosplash -application org.eclipse.equinox.p2.director -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ -list "Q:everything.select(x | x.properties ~= filter(\"(org.eclipse.equinox.p2.type.group=true)\"))"
-> produces list
eclipsec.exe -nosplash -application org.eclipse.equinox.p2.director -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ -list "Q:everything.select(x | x.properties ~= filter("(org.eclipse.equinox.p2.type.group=true)"))"
without \" -> empty output
st. eclipsec -nosplash -application org.eclipse.equinox.p2.director -repository jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/ -list "Q:everything.select(x | x.properties ~= filter(\"(org.eclipse.equinox.p2.type.group=true)\"))"
from Node -> empty output
=> filtering list using JavaScript

eclipsec.exe -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/eclipse/updates/4.3 -installIU org.eclipse.sdk.ide -tag InitialState -destination e:/eclipsediy/ -profile  SDKProfile -profileProperties org.eclipse.update.install.features=true -bundlepool d:/eclipsediy/ -p2.os win32 -p2.ws win32 -p2.arch x86 -roaming

*/

//TODO can't update
//TODO epm install from nodeclipse,kepler nodejs 
// -> too long wating time, recommend to split or use &&
// epm install from kepler jsdt
// epm install nodejs
//TODO specify repository for plugin, e.g. for `less` => not to add it automatically as delays may be big.
// User is to list `help aliases` to see repository name

var plugins = [
	{alias: 'egit', name: 'org.eclipse.egit.feature.group'}, //TODO check if works without ',org.eclipse.jgit.feature.group' and updates both
	{alias: 'git', name: 'gitaddon.feature.feature.group'},
	{alias: 'gfm', name: 'code.satyagraha.gfm.viewer.feature.feature.group'},
	{alias: 'gradle', name: 'org.nodeclipse.enide.gradle.feature.feature.group,org.nodeclipse.enide.editors.gradle.feature.feature.group'},
	{alias: 'hudson', name: 'org.eclipse.mylyn.hudson.feature.group'},
	{alias: 'icons', name: 'org.eclipse_icons.editor.feature.feature.group'},
	{alias: 'jjs', name: 'org.nodeclipse.jjs.feature.feature.group'},
	{alias: 'jsdt', name: 'org.eclipse.wst.jsdt.feature.feature.group', repository: 'current'}, // requires kepler,etc update site
	{alias: 'less', name: 'net.vtst.ow.eclipse.less.feature.feature.group', repository: 'enide-repository'}, // TODO
	{alias: 'markdown', name: 'markdown.editor.feature.feature.group'},
	{alias: 'maven', name: 'org.nodeclipse.enide.maven.feature.feature.group'}, //org.nodeclipse.enide.maven.feature.feature.jar,
	{alias: 'mongodb', name: 'net.jumperz.app.MMonjaDB.feature.group'},
	{alias: 'mongodb.shell', name: 'org.nodeclipse.mongodb.feature.feature.group'},
	{alias: 'moonrise', name: 'com.github.eclipseuitheme.themes.feature.feature.group'},
	{alias: 'nodejs', name: "org.nodeclipse.feature.group,org.chromium.sdk.feature.group,org.chromium.debug.feature.group,com.eclipsesource.jshint.feature.feature.group"}, //TODO org.nodeclipse.enide.nodejs.feature
	{alias: 'phantomjs', name: 'org.nodeclipse.phantomjs.feature.feature.group'},
	{alias: 'pluginslist', name: 'org.nodeclipse.pluginslist.feature.feature.group'},
	{alias: 'restclient', name: 'code.google.restclient.tool.feature.feature.group'},
	{alias: 'shelled', name: 'net.sourceforge.shelled.feature.group'},
	{alias: 'startexplorer', name: 'de.bastiankrol.startexplorer.feature.feature.group'},
	{alias: 'themes', name: 'net.jeeeyul.eclipse.themes.feature.feature.group'},
	{alias: 'wikitext', name: 'org.eclipse.mylyn.wikitext_feature.feature.group'}, // textile, mediawiki, tracwiki, twiki
	{alias: 'yaml', name: 'org.dadacoalition.yedit.feature.group'},
];
var repositories = [
	{name: 'dev', url: 'jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/'},//hack to help author                    
	{name: 'nodeclipse-updates', url: 'http://www.nodeclipse.org/updates/'},
	{name: 'enide-repository', url: 'https://raw.github.com/Enide/eclipse-p2-composite-repository/master/'},
	{name: 'indigo', url: 'http://download.eclipse.org/releases/indigo'},
	{name: 'juno', url: 'http://download.eclipse.org/releases/juno'},
	{name: '4.3', url: 'http://download.eclipse.org/eclipse/updates/4.3'}, // is part of kepler
	{name: 'kepler', url: 'http://download.eclipse.org/releases/kepler'}, //current
	{name: 'current', url: 'http://download.eclipse.org/releases/kepler'}, //current
	{name: '4.4', url: 'http://download.eclipse.org/eclipse/updates/4.4'},
	{name: 'luna', url: 'http://download.eclipse.org/releases/luna'},
];

/* from pom.xml
<environments>
<environment>
	<os>linux</os>
	<ws>gtk</ws>
	<arch>x86</arch>
</environment>
<environment>
	<os>linux</os>
	<ws>gtk</ws>
	<arch>x86_64</arch>
</environment>
<environment>
	<os>win32</os>
	<ws>win32</ws>
	<arch>x86</arch>
</environment>
<environment>
	<os>win32</os>
	<ws>win32</ws>
	<arch>x86_64</arch>
</environment>
<environment>
	<os>macosx</os>
	<ws>cocoa</ws>
	<arch>x86_64</arch>
</environment>
</environments>
*/

var environments = [
{name: 'linux32', node: 'linux-ia32', os:'linux', ws:'gtk', arch:'x86'},
{name: 'linux64', node: 'linux-x64', os:'linux', ws:'gtk', arch:'x86_64'},
{name: 'win32',	node: 'win32-ia32', os:'win32', ws:'win32', arch:'x86'},
{name: 'win64',	node: 'win32-x64', os:'win32', ws:'win32', arch:'x86_64'},
{name: 'macosx',	node: 'darwin-x64', os:'macosx', ws:'cocoa', arch:'x86_64'},
];


//OS {
var getEnvironmentObject = function(){
	//process.arch#
	//What processor architecture you're running on: 'arm', 'ia32', or 'x64'.
	//console.log('This processor architecture is ' + process.arch);
	//process.platform#
	//What platform you're running on: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32' 
	//os.arch() + os.platform() + os.type() // -> x64win32Windows_NT
	var lookupOS = function(platform_arch){ // uses repositories
		for (var ei=0; ei<environments.length; ei++){
			var environment = environments[ei];
			if (platform_arch===environment.node){
				return environment;
			}
		}
		return null;
	};
	
	var os = require('os');
	var platform_arch= os.platform()+'-'+os.arch();
	
	var environment = lookupOS(platform_arch);
	
	if (environment){
		console.log(platform_arch+' -> '+ JSON.stringify(environment));
	} else{
		console.log('No mapped environment for '+platform_arch+'. Exiting...');
		process.exit(1);
	}
	return environment;
};
//OS }


console.log('Nodeclipse CLI Installer (nci , Eclipse Plugin Manager epm)');
var repository = 'http://www.nodeclipse.org/updates/'; // =repositories[1].url
var plugin = ''; //default - no plugins

var argv = process.argv; // 0 - node, 1 - app.js
//`===` does not compare strings well
if (argv[2]=='i'){
	argv[2]='install';
}

if (argv.length === 2 
	|| argv[2]=='help' || argv[2]=='--help' || argv[2]=='-h' 
	//|| ( argv[2]=='list' && !argv[3]) //will list default repository
	|| !(argv[2]=='install' || argv[2]=='i' || argv[2]=='materialize' || argv[2]=='new' || argv[2]=='list'  
		|| argv[2]=='uninstall' || argv[2]=='update') 
	)
{
	console.log('    nodeclipse help');
	console.log('    nodeclipse help aliases');
	console.log('  Usage (from folder with eclipse):');
	console.log('    nodeclipse list [<repository>]');
	console.log('      repository may be name (nodeclipse, kepler, luna) or URL (http of file)');
	var repositoriesNames = 'Repositories names('+repositories.length+'): ';
	for (var ri=0; ri<repositories.length; ri++){
		repositoriesNames += repositories[ri].name+' ';
	}
	console.log('        '+repositoriesNames);	
	console.log('      default repositoryURL is '+repository);
	console.log('      <repository> may be file e.g. jar:file:/D:/path/to/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/');
//	console.log('      repositoryURL may be file e.g. jar:file:/D:/Workspaces/Nodeclipse-DEV/nodeclipse-1/org.nodeclipse.site/target/org.nodeclipse.site-0.10.0-SNAPSHOT.zip!/');
	console.log('    nodeclipse install <alias|exact.feature.name.feature.group> [...]');
	console.log('    nodeclipse install from <repository> <alias|exact.feature.name.feature.group> [...]');
	console.log('    nodeclipse uninstall <alias|exact.feature.name.feature.group> [...]');
	console.log('    nodeclipse update [from <repository>] <alias|exact.feature.name.feature.group> [...]');
    console.log('    nodeclipse install all from <repository> // BE CAREFUL WHAT YOU ASK FOR');
//	console.log('    nodeclipse install [-repository repositoryURL] <alias|exact.feature.name.feature.group> [...]');
    console.log('    nodeclipse materialize [from <repository>] to <folder>');
    console.log('    nodeclipse materialize from <repository> [for <environemt>] to <folder>');
	var environmentNames = 'Environment names('+environments.length+'): ';
	for (var ei=0; ei<environments.length; ei++){
		environmentNames += environments[ei].name+' ';
	}
	console.log('        '+environmentNames);	

	var mappedAliases = '        Plugin aliases('+plugins.length+'): ';
	for (var mi=0; mi<plugins.length; mi++){
		mappedAliases += plugins[mi].alias+' ';
	}
	console.log(mappedAliases);
	if (argv[3]==='aliases'){
		console.log('mappings: '+JSON.stringify(plugins,null,2));
	}
    console.log('\n    Examples:');
    console.log('    nodeclipse install egit');
    console.log('    nodeclipse install markdown wikitext yaml');
    console.log('    nodeclipse install from nodeclipse,kepler nodejs');
    console.log('    nodeclipse install from enide less');
    console.log('    nodeclipse materialize from luna to e:/builder/eclipse1/');
    
	console.log('\n  Visit http://www.nodeclipse.org/ for News, post Shares, Installing details, Features list,' 
			+' Usage (incl Video, Demo) with all shortcuts, Help and Hints,'
			+' Support options, Where Helping needed, How to thank and Contact us, also History page.');
	console.log('Project page: https://github.com/Nodeclipse/nodeclipse-1/tree/master/org.nodeclipse.ui/templates#nodeclipse-cli-installer');
	process.exit();
};

//-- processing commands logic
var verbose = false;
var startingIndex = 3;
var listInstallAllMode = false;
if (argv[2]=='list'){ // this does not work (from http://www.jshint.com/docs/): jshint ignore:line
	var command = 'list';
	if (argv[3]){ //overrride default repository
		repository = argv[3];
	}
} else if (argv[2]=='install'){
	var command = 'install';
	if (argv[3]=='all'){
		// list, then install
		listInstallAllMode = true;
		if (argv[4]=='from'){
			if (argv[5]){
				repository = argv[5];
				startingIndex = 6; //won't be used; TODO do all-except-for mode ?
			}
		}
	}
	if (argv[3]=='from'){// was  || argv[3]=='-repository'
		if (argv[4]){
			repository = argv[4];
			startingIndex = 5;
		}
	}
} 
//TODO nci uninstall mongodb.shell
else if (argv[2]=='uninstall'){
	var command = 'uninstall';
} 
else if (argv[2]=='update'){
	var command = 'update';
	if (argv[3]=='from'){// was  || argv[3]=='-repository'
		if (argv[4]){
			repository = argv[4];
			startingIndex = 5;
		}
	}
} 
//TODO nci new [from kepler] to e:/builder/eclipse1/
else if (argv[2]=='materialize' || argv[2]=='new'){
	var command = 'materialize';
	repository = 'current';
	var destination = 'e:/builder/eclipse1/';
	plugin = 'org.eclipse.sdk.ide,'; // default for new Eclipse
	if (argv[3]=='from'){
		if (argv[4]){
			repository = argv[4];
			startingIndex = 5;
			//
			if (argv[5]=='to'){
				if (argv[6]){
					destination = argv[6];
					startingIndex = 7;
				}
			}
		}
	}
	if (argv[3]=='to'){
		if (argv[4]){
			destination = argv[4];
			startingIndex = 5;
		}
	}
}

//-- looking up

// lookup plugin alliases
var comma_separated_list = plugin;
if (!listInstallAllMode){ // uses plugins
	for (var i=startingIndex; i<argv.length; i++){
		var argi = argv[i];
		var found = false;
		for (var mi=0; mi<plugins.length; mi++){
			if (argi===plugins[mi].alias){
				found = true;
				comma_separated_list += plugins[mi].name+',';
				break;
			}
		}
		if (found) continue;
		comma_separated_list += argi+','; //passing as is
	}
	// delete last comma
	comma_separated_list = comma_separated_list.substring(0, comma_separated_list.length-1);
}
plugin = comma_separated_list;


//DONE lookup repositories names
var lookupRepositoriesNames = function(repositorystring){ // uses repositories
	var repositories_comma_separated_list = '';
	var reparray = repositorystring.split(",");
	for (var i=0; i<reparray.length; i++){
		var repi = reparray[i];
		console.log(repi);
		var found = false;
		for (var ri=0; ri<repositories.length; ri++){
			if (repi===repositories[ri].name){
				found = true;
				repositories_comma_separated_list += repositories[ri].url+',';
				break;
			}
		}
		if (found) continue;
		repositories_comma_separated_list += repi+','; //passing as is
	}
	// delete last comma
	repositories_comma_separated_list = repositories_comma_separated_list.substring(0, repositories_comma_separated_list.length-1);
	return repositories_comma_separated_list;
};
repository = lookupRepositoriesNames(repository);

if (command == 'materialize'){
	var env = getEnvironmentObject();
	if (!env) return;
	var p2os = env.os;
	var p2ws = env.ws;
	var p2arch = env.arch;
}

// executing
//--- section below can be re-used for scripts with hard-coded values // Copyright 2014 ... http://www.nodeclipse.org/
var child_process = require('child_process');
var spawn = child_process.spawn;
var isWin = /^win/.test(process.platform);
var what = isWin ? 'eclipsec' : 'eclipse'; // see [How do I run Eclipse?](https://wiki.eclipse.org/FAQ_How_do_I_run_Eclipse%3F)
//var repository = 'http://www.nodeclipse.org/updates/';

//var command = '-list';
//var query = '"Q:everything.select(x | x.properties ~= filter(\"(org.eclipse.equinox.p2.type.group=true)\"))"';
//var query = '"Q:everything.select(x | x.properties ~= filter(\\\"(org.eclipse.equinox.p2.type.group=true)\\\"))"';
var query = ''; //both option fails with Node

var optionsList = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
                   '-list', query]; //enough for -list
var optionsInstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
               '-installIU', plugin, '-tag', plugin, '-vmargs', '-Declipse.p2.mirrors=false'];
var optionsUninstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
                      '-uninstallIU', plugin, '-tag', plugin];
var optionsUpdate = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
                     '-uninstallIU', plugin, '-installIU', plugin, '-tag', plugin, '-vmargs', '-Declipse.p2.mirrors=false'];

//DONE nci materialize from kepler to e:/builder/eclipse1/

/* eclipsec.exe -application org.eclipse.equinox.p2.director -repository http://download.eclipse.org/eclipse/updates/4.3 
 -installIU org.eclipse.sdk.ide -tag InitialState -destination e:/eclipsediy/ -profile  SDKProfile
 -profileProperties org.eclipse.update.install.features=true -bundlepool d:/eclipsediy/ -p2.os win32 -p2.ws win32 -p2.arch x86 -roaming

'-application', 'org.eclipse.equinox.p2.director', '-repository', 'http://download.eclipse.org/eclipse/updates/4.3', 
'-installIU', 'org.eclipse.sdk.ide', '-tag', 'InitialState', '-destination', 'e:/eclipsediy/', 
'-profile', 'SDKProfile', '-profileProperties', 'org.eclipse.update.install.features=true', '-bundlepool', 'd:/eclipsediy/',
'-p2.os', 'win32', '-p2.ws', 'win32', '-p2.arch', 'x86', '-roaming'

*/
var optionsMaterialize = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
                      '-installIU', plugin, '-tag', plugin, '-destination', destination,
'-profile', 'SDKProfile', '-profileProperties', 'org.eclipse.update.install.features=true', '-bundlepool', destination,
'-p2.os', p2os, '-p2.ws', p2ws, '-p2.arch', p2arch, '-roaming'];


//-- subs {
var log2console = function (data) {
	console.log(data);
};
var outputString = '';
var log2consoleAndString = function (data) {
	console.log(data);
	outputString += data;
};
var onExitShowCode = function (code) {
	console.log(what+' process exit code ' + code);
};
//var onExitShowCodeAndRetryIfMissing = function (code) { // uses comma_separated_list
//	console.log(what+' process exit code ' + code);
//	if (code===0) return;
//	// if there were "Missing requirement" string, then retry with eclipse.p2.mirrors enabled
//	if (outputString.indexOf('Missing requirement')===-1) return;
//	console.log("Retry with eclipse.p2.mirrors enabled as there were Missing requirement");
//	var tag = 'retry_all_from_'+repository;
//	optionsInstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
//	                  '-installIU', comma_separated_list, '-tag', tag];
//	
//	var spawned = spawning(what, optionsInstall, log2consoleAndString, onExitShowCode);
//}
var onExitShowCodeAndContinue = function (code) {
	console.log(what+' process exit code ' + code);
	if (verbose) console.log(outputString);
	var array = outputString.split("\n");
	var filtered = array.filter( function(s){return s.indexOf('feature.group')!==-1;} );
	console.log(filtered);
	if (code!=0) return;
	
	var all_comma_separated_list = '';
	for (var i=0; i<filtered.length; i++){
		var feature = filtered[i].replace('=', '/').replace('\r', '');
		all_comma_separated_list += feature+',';
	}
	// delete last comma
	all_comma_separated_list = all_comma_separated_list.substring(0, all_comma_separated_list.length-1);
	var tag = 'all_from_'+repository;
	optionsInstall = ['-nosplash', '-application', 'org.eclipse.equinox.p2.director', '-repository', repository,
	                      '-installIU', all_comma_separated_list, '-tag', tag, '-vmargs', '-Declipse.p2.mirrors=false'];
	
	var spawned = spawning(what, optionsInstall, log2console, onExitShowCode);
};
var spawning = function (what, options, dataHandler, closeHandler) {
	var spawned = spawn(what, options);
	console.log('starting '+what+' '+options.join(' '));
	spawned.stdout.setEncoding('utf8');
	spawned.stdout.on('data', dataHandler);
	spawned.stderr.setEncoding('utf8');
	spawned.stderr.on('data', dataHandler);
	spawned.on('close', closeHandler);
	return spawned;
};
//-- subs }

if ( command == 'list'){ 
	var spawned = spawning(what, optionsList, log2console, onExitShowCode);
} else if ( command == 'materialize'){
	var spawned = spawning(what, optionsMaterialize, log2console, onExitShowCode);
} else if (command == 'install') { 
	if (listInstallAllMode){
		//spawn 2 times
		var spawned = spawning(what, optionsList, log2consoleAndString, onExitShowCodeAndContinue);
	} else {
		var spawned = spawning(what, optionsInstall, log2console, onExitShowCode);
	}
} else if ( command == 'uninstall'){
	var spawned = spawning(what, optionsUninstall, log2console, onExitShowCode);
} else if ( command == 'update'){
	var spawned = spawning(what, optionsUpdate, log2console, onExitShowCode);
} else {
	console.log("Unexpected command "+command);
	console.log("Try nodeclipse help");
	process.exit(1);
}
