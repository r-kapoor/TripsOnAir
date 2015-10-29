'use strict';


module.exports = function jshint(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Options
    return {
        //files: ['controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        files: ['public/js/angularController/travelPageAngularController/*.js',
            'public/js/angularController/homeController/*.js',
            'public/js/angularDirective/*.js',
            'public/js/angularFilter/*.js',
            'public/js/angularService/**/*js'
            ],
        options: {
            //jshintrc: '.jshintrc',
            //'-W116' : true,
            //'-W117' : true,
            //'-W097' : true,
            '-W041' : true
        }
    };
};
