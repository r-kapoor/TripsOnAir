/**
 * Created by rkapoor on 01/06/15.
 */
'use strict';

module.exports = function uglify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Options
    return {
        build : {
            src : 'public/js/production/travelPage.js',
            dest : 'public/js/production/travelPage.min.js'
        }
    };
};
