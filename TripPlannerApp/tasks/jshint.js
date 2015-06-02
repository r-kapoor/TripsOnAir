'use strict';


module.exports = function jshint(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Options
	return {
		//files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
		files: ['public/js/angularController/travelPageAngularController/*.js'],
		options: {
		    jshintrc: '.jshintrc'
		}
	};
};
