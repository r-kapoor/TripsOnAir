
var argv = require('optimist')
// optimist: all one letter parameters maybe stacked after '-'
// all others should be with '--'
// '-cg proj1' becomes '-c -g=proj1', so it should be '-cgn proj1'
			.alias('c','create') .describe('c', 'create project folder and prepare it')
			//.alias('n','eclipse_project_nodeclipse')
			.alias('g','eclipse_project_general')
			.alias('p','prepare').describe('p', 'prepare for import, i.e. add needed `.project` and other `.*` file ')
			.string('n')
			.alias('n','name')   .describe('h', 'project name (default is folder name)')
			.boolean(['h','v','V'])
			.alias('h','help')   .describe('h', 'lists usage arguments')
			.alias('v','version').describe('v', 'print nodeclipse CLI version')			
			.alias('V','verbose').describe('V', 'be verbose')
			.argv;

var helpstr = 
"  Usage: nodeclipse [arguments] \n\
  `nodeclipse --help install` for Nodeclipse CLI Installer Help\n\
\n\
Arguments: \n\
-c, --create <name>      create project folder and prepare it \n\
-u, --use <template>     use/copy specified template when creating project \n\
-p, --prepare            prepare Nodeclipse [Node.js] project for import, i.e. add needed `.project` file and other `.*`\n\
                      files ('.gitignore', '.jshintrc', '.settings/') if there is no `.project` yet\n\
-g, --eclipse_project_general   prepare General Eclipse project for import, i.e. add only needed `.project` file\n\
-n, --name [<name>]      project name (default is folder name)\n\
-h, --help               this help screen\n\
-v, --version            print nodeclipse CLI's version\n\
-V, --verbose            be verbose\n\
\n\
Templates are just folders in this project sources:\n\
hello-world              The famous hello world HTTP server in 6 lines\n\
hello-coffee             The same server written in CoffeeScript\n\
hello-typescript         The same server written in TypeScript\n\
hello-html		         Template with HTML file\n\
template-gradle-java     Gradle Java project\n\
template-maven-java      Maven Java project\n\
";


require('shelljs/global');
var fs= require('fs');
var path= require('path');

var debug = false;
if (debug) console.dir(process.argv);
if (debug) console.dir(argv);

// arguments processing 
var help = argv.help || argv.h || (process.argv.length <= 2);
var version = argv.version || argv.v;
var create = argv.create || argv.c;
var use = argv.use || argv.u || argv.template || argv.t;
//var create = create || use;
if (!create && use){
	console.log("Template usage without folder creation!");
	return;
}
var projectGeneral = argv.e || argv.eclipse_project_general;
var projectNodeclipse = argv.en || argv.project_eclipse_nodeclipse; //TODO
var prepare = argv.prepare || argv.p || (create && (!projectGeneral) ) ; // not triggered by `create` as it maybe `project_general` as well 
var name = argv.name || argv.n; // could be   create || 
var verbose = debug || argv.verbose || argv.V;

var projectFileExists = false; 

fs.exists('./.project', function check(exists) {
	projectFileExists = exists;
	executeActions();
});

var pathIsDirecory = function (filepath) {
	stats = fs.statSync(filepath);
	return  stats.isDirectory();
	//fs.statSync(filepath).isDirectory()
}

//BUG #71 (on x64bit JDK output is less)

var executeActions = function () {
	//if (debug) console.log(require.main.filename); // = __filename
	//if (debug) console.dir(argv);
	//console.log('Passed parameters: name=%s, verbose=%s', argv.name, argv.verbose);

	if (help){

// the following code snippet from optimist README.md has error below		
		    
//		var s = fs.createReadStream(argv.file);
//
//		var lines = 0;
//		s.on('data', function (buf) {
//		    lines += buf.toString().match(/\n/g).length;
//		});
//		s.on('end', function () {
//		    console.log(lines);
//		});

//		fs.js:404
//		  binding.open(pathModule._makeLong(path),
//		          ^
//		TypeError: path must be a string
//		    at Object.fs.open (fs.js:404:11)

		console.log(helpstr);
		console.log("Check README.md and sources at "+__dirname
				+" or https://github.com/Nodeclipse/nodeclipse-1/tree/master/org.nodeclipse.ui/templates/");	
		return;
	}
	if (version){
		console.log("Nodeclipse CLI "+require('./package.json').version );		
		return;
	}
	if (projectFileExists && !create) {
		console.log(".project file already exists!");
		return;
	}
	
	//copyFromTemplates
	if (create){
		if (create.toString().length===0){
			console.error("Folder/project name is required for creation!");
			//process.exit(1);
			return;
		}
		mkdir(create);
		cd(create);
		if (verbose) console.log("Created project/folder: " + create);
	}
	
	var curfolder = pwd();
	var templatesfolder = __dirname;
	if (debug) console.log("Templates folder is: " + templatesfolder);
	if (!name){
		name = path.basename(curfolder);
	}	

	if (use){ //template
		//cp(__dirname+use+'/*','.');
		var fromfolder = path.join(templatesfolder, use, '/*') 
		if (verbose) console.log("Copying from "+ fromfolder );
		cp( fromfolder, '.' )
		
		if(use.indexOf('template') == 0 ){ //.startsWith() //http://stackoverflow.com/questions/646628/javascript-startswith
			// template-* do not use common-templates
			
			// .files special treatment ( Node.js shelljs is likely not good tool for this)
			copyDotProjectFile(use, curfolder, '/.project', name);
			copyDotProjectFile(use, curfolder, '/.classpath', name);
			
			inviteToSiteAsTheLastLine();
			return;
		}
	}
	
	// common-templates 
	if (prepare){
		//var fromfolder = path.join(templatesfolder, 'common-templates', '/*') 
		var fromfolder = path.join(templatesfolder, 'common-templates')
		if (verbose) console.log("Copying from "+ fromfolder );
	
		//cp( '-A', fromfolder, '.' )
		// not copying .files: #79 https://github.com/arturadib/shelljs/issues/79
		
		//console.log( fs.readdirSync(fromfolder) ); --> [ '.gitignore', '.jshintrc', '.settings', 'README.md' ]
		mkdir('.settings'); //HACK1
		//for file in find(fromfolder)
		find(fromfolder).forEach( function copyFile(file) {
			if (verbose) console.log("Copying "+ file );
			// cp(file,'.'); // This does not recreate subfolders - DONE with HACK1
			
			// check and skip if the file is directory
			//if pathIsDirecory(file)
			if ( fs.statSync(file).isDirectory() )
				return true; //continue
			
			//HACK1
			if ( ~ file.indexOf('.settings') )// if contains // returns a truthy value if the substring is found, and a falsy value (0) if it isn’t. (-1 becomes 0)
				cp(file,'.settings/'); 
			else	
				cp(file,'.');   
		});
		
	}
	
	// .project
	if (debug) console.log('projectNodeclipse='+projectNodeclipse+', projectGeneral='+projectGeneral);
	if (verbose) console.log("Current folder is: " + curfolder);
	if (prepare){
		copyDotProjectFile('eclipse', curfolder, '/.project', name);
	} else if (projectGeneral){
		copyDotProjectFile('eclipse-project-general', curfolder, '/.project', name);
	}
	
	inviteToSiteAsTheLastLine();
}
var copyDotProjectFile = function (eclipse, curfolder, what, name) {
	if (!eclipse) eclipse = 'eclipse';
	if (!what) eclipse = '/.project';
	var str = cat(__dirname+'/'+eclipse + what).replace('${projectname}', name);
	var destfile = curfolder + what;
	
	// http://www.nodejs.org/api/fs.html#fs_fs_appendfile_filename_data_options_callback	
	fs.writeFile(destfile, str, function(err) {	
		if (err)
			throw err;
		if (verbose) console.log('The file "'+destfile+'" was created !');
		if (what == '/.project'){
			console.log('In Eclipse/Enide select File -> Import... -> General / Existing Projects into Workspace');
			console.log('and enter project directory: '+curfolder);
		}
	});
	
	if (debug) console.log(str); // ''.toString()
	
}
var inviteToSiteAsTheLastLine = function () {
	setTimeout(inviteToSite,100);
}
var inviteToSite = function () {
	console.log('\n  Visit http://www.nodeclipse.org/ for News, post Shares, Installing details, Features list,' 
			+' Usage (incl Video, Demo) with all shortcuts, Help and Hints,'
			+' Support options, Where Helping needed, How to thank and Contact us, also History page.');
}
