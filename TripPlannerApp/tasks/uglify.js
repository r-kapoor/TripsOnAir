/**
 * Created by rkapoor on 01/06/15.
 */
'use strict';

module.exports = function uglify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Options
    return {
        travelPage : {
            src: 'public/js/production/travelPage.js',
            dest: 'public/js/production/travelPage.min.js'
        },
        homePage : {
            src : 'public/js/production/homePage.js',
            dest : 'public/js/production/homePage.min.js'
        }
    };
};
