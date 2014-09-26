

# Nodeclipse CLI & Installer

## Node.js Development with Eclipse or Enide Studio

Install with `npm install -g nodeclipse`

Usage: just run `nodeclipse -p` to add needed `.project` file to current directory

In Eclipse `File -> Import -> General / Existing Projects into Workspace`

Check <http://www.nodeclipse.org/> on how to get Nodeclipse or Enide Studio

## Nodeclipse CLI Commands

	Usage: nodeclipse [arguments]

	Arguments:
	  -c, --create <name>      create project folder <name> [using template] and prepare it
	  -u, --use <template>     use/copy specified template when creating project
	  -p, --prepare            prepare Nodeclipse [Node.js] project for import, i.e. add needed `.project`
	  							and other `.*` files ('.gitignore', '.jshintrc', '.settings/') if there is no `.project` yet
      -g, --eclipse_project_general   prepare General Eclipse project for import, i.e. add only needed `.project` file
	  -n, --name [<name>]      project name (default is folder name)
	  -h, --help               Check README
	  -v, --version            print nodeclipse CLI's version
	  -V, --verbose            be verbose

	Templates are just folders in this project sources:
	  hello-world              The famous hello world HTTP server in 6 lines
	  hello-coffee	           The same server written in CoffeeScript
	  hello-typescript         The same server written in TypeScript
	  hello-html		       Template with HTML file
	  template-gradle-java     Gradle Java project
	  template-maven-java      Maven Java project
	  
Examples:

	nodeclipse -p
	
	nodeclipse --prepare project1
	
	nodeclipse --create project2
	
	nodeclipse --create project3 --use hello-coffee
	
	nodeclipse -c project4 -u hello-coffee


## Nodeclipse CLI installer

Nodeclipse CLI installer is for installing/updating plugins into Eclipse/Enide Studio.
It is much quicker way when you need to automate and know exactly what you need.

	cd path/to/eclipse
	nodeclipse install egit

or if you are in a hurry

	cd path/to/eclipse && nodeclipse i gfm markdown startexplorer
	
If while installing you get errors, that you don't know how to solve, use Eclipse GUI or raise an issue.	

  Usage: nodeclipse install [aliases]
  Mapped aliases: egit git gfm gradle icons jjs markdown mongodb mongodb.shell moonrise nodejs phantomjs pluginslist restclient shelled startexplorer
  
Issues: 
- When updating, I noticed that Eclipse once reported conflict when installing 'nodejs', but was OK for second try.  
- Cannot resolute to install required JSDT for Nodeclipse nodejs. Install JSDT version specific for your Eclipse version. (use Eclipse GUI)

## Eclipse Workspace and Project

Eclipse Workspace is just folder that contains Eclipse Projects.
Eclipse Projects is just folder with `.project` file.

## Developing Nodeclipse CLI

[#91](https://github.com/Nodeclipse/nodeclipse-1/issues/91)

Project sources are at https://github.com/Nodeclipse/nodeclipse-1
under https://github.com/Nodeclipse/nodeclipse-1/tree/master/org.nodeclipse.ui/templates

<https://npmjs.org/doc/developers.html>

before publishing
- try with `npm install . -g`
- check that nodeclipse.js line ending is UNIX style (#101)

[#4341](https://github.com/isaacs/npm/issues/4341) `common-templates/.gitignore` becomes `common-templates/.npmignore` 

#### Links

> The only feature that differentiates a command-line program from a library is the bin field in the package.json file.

<http://howtonode.org/how-to-module>

### Ideas

	$ nodeclipse -h
	Usage: nodeclipse [directory] [arguments]
	
      -f, --force              force on non-empty directory (by default existing files are not updated)
	  -pg					as general project
	  -pn	 				as Nodeclipse Node.js project (default)
	  -t, --template <template>     use/copy specified template when creating project (see also `git init`)
	  --gitclone <repository>			call git clone [directory]
	  --js2njs (renamejs)
	  --njs2js 
	  
TODO Examples:

	git clone repository directory
	nodeclipse directory -pg	
	
	nodeclipse directory -pg --gitclone repository 
	nodeclipse --gitclone repository directory -pg (bad?)
	
Dream - I wish I could get current project in GitHub as project in Eclipse with 1 click.
options are: 	
- eclipse wizards accessible with icon, where I only need to git repository URL
- add link on Wizard Page
- options to refine .jshintrc

Build Eclipse Java Project from Command Line
http://stackoverflow.com/questions/206473/build-eclipse-java-project-from-command-line

List of workspace projects
`<workspace>\.metadata\.plugins\org.eclipse.core.resources\.projects\`

- http://stackoverflow.com/questions/251116/where-in-an-eclipse-workspace-is-the-list-of-projects-stored
- http://stackoverflow.com/questions/1718456/create-an-eclipse-project-on-the-command-line
- http://stackoverflow.com/questions/8908219/eclipse-import-project-using-command-line
- http://stackoverflow.com/questions/206473/build-eclipse-java-project-from-command-line

	eclipsec.exe -noSplash -data "D:\Source\MyProject\workspace" -application org.eclipse.jdt.apt.core.aptBuild
	
	java -cp startup.jar -noSplash -data "D:\Source\MyProject\workspace" -application org.eclipse.jdt.apt.core.aptBuild

## History

- 0.8.2 fix #101 (bug on MacOS); -g option
- 0.8.3 fix general project template
- 0.10.0 add 2 java templates
- 0.10.5 add Nodeclipse CLI Installer (example `nodeclipse install markdown`)
- 0.10.6 fix #101 again; total aliases=20 
- 0.10.8 add maven, gradle features; install from .zip; install all 
- 0.10.9 comma-sep-list of repositories; lookup for repositories.  
	Examples: `nci install from kepler jsdt` 
- 0.10.10 uninstall, materialize
	Examples: `nci uninstall mongodb.shell` , `nci new from luna to d:/progs/eclipse-diy-luna/`
- 0.11.0 `update` command as p2-director needs uninstall then install (example `nodeclipse update markdown`)

## News

Check <http://www.nodeclipse.org/>
