/**
 * Created by rkapoor on 01/06/15.
 */
'use strict';

module.exports = function concat(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Options
    return {
        travelPage : {
            src : [
                'public/js/angularController/travelPageAngularController/routesApp.js',
                'public/js/angularController/travelPageAngularController/shabari.js',
                'public/js/angularController/travelPageAngularController/sanjaya.js',
                'public/js/angularController/travelPageAngularController/sarathi.js',
                'public/js/angularController/travelPageAngularController/surya.js',
                'public/js/angularController/travelPageAngularController/indra.js',
                'public/js/angularService/travelPageAngularService/orderedCitiesService.js',
                'public/js/angularFilter/titleCase.js',
                'public/js/angularFilter/formatTime.js',
                'public/js/angularJS/angular-pageslide-directive.js',
                'public/js/angularJS/ngDraggable.js',
                'public/js/angularController/travelPageAngularController/balarama.js',
                'public/js/jscrollPaneJS/jquery.mousewheel.js',
                'public/js/jscrollPaneJS/jquery.jscrollpane.min.js',
                'public/js/angularJS/angular-jscrollpane.js',
                'public/js/angularJS/intro.min.js',
                'public/js/angularJS/angular-intro.min.js'
            ],
            dest : 'public/js/production/travelPage.js'
        },
        homePage : {
            src : [
                'public/js/angularJS/angular-scroll.min.js',
                'public/js/angularController/homeController/inputApp.js',
                'public/js/angularController/homeController/indra.js',
                'public/js/angularController/homeController/form.js',
                'public/js/angularController/homeController/datePicker.js',
                'public/js/angularJS/ng-slider.min.js',
                'public/js/angularDirective/restrictInput.js',
                'public/js/angularController/homeController/addCity.js',
                'public/js/angularService/cityDataService.js',
                'public/js/angularService/formDataService.js',
                'public/js/angularJS/slider.js',
                'public/js/angularController/homeController/kuber.js',
                'public/js/angularController/homeController/brahma.js',
                'public/js/jscrollPaneJS/jquery.mousewheel.js',
                'public/js/jscrollPaneJS/jquery.jscrollpane.min.js',
                'public/js/angularJS/angular-jscrollpane.js',
                'public/js/angularController/homeController/selectedDestinationsPanel.js',
                'public/js/angularController/homeController/krishna.js',
                'public/js/angularController/homeController/bhishma.js'
            ],
            dest : 'public/js/production/homePage.js'
        },
        hotelsAndPlacesPage : {
            src : [
                'public/js/angularJS/angular-scroll.min.js',
                'public/js/angularDirective/fixToTop.js',
                'public/js/angularJS/angular-timeline.js',
                'public/js/angularDirective/scrollInview.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/page3Main.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/shabari.js',
                'public/js/angularService/hotelsAndPlacesPageAngularService/mapDataService.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/jatayu.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/shakuni.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/hanuman.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/indra.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/saveModalInstance.js',
                'public/js/angularController/hotelsAndPlacesPageAngularController/detailsModalInstance.js',
                'public/js/angularJS/verge.min.js',
                'public/js/angularJS/lodash.min.js',
                'public/js/angularJS/intro.min.js',
                'public/js/angularJS/angular-intro.min.js',
                'public/js/jscrollPaneJS/jquery.mousewheel.js',
                'public/js/jscrollPaneJS/jquery.jscrollpane.min.js',
                'public/js/angularJS/angular-jscrollpane.js'
            ],
            dest : 'public/js/production/hotelsAndPlacesPage.js'
        }
    };
};
