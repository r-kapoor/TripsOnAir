/**
 * Created by rkapoor on 30/10/15.
 */
'use strict';

module.exports = function cssmin(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Options
    return {
        homePage: {
            files: {
                'public/css/production/homePage.min.css': [
                    'public/css/bootstrapCSS/bootstrap-slider.css',
                    'public/css/angularCSS/ng-slider.css',
                    'public/js/jscrollPaneJS/jquery.jscrollpane.css',
                    'public/css/JscrollPaneCSS/ItineraryPanelJscrollPane.css',
                    'public/css/home/inputs.css',
                    'public/css/krishna.css',
                    'public/css/home/fonts-awesome.css',
                    'public/css/home/flexslider.css',
                    'public/css/home/style4.css',
                    'public/css/global/stickyFooter.css'
                ]
            }
        },
        travelPage: {
            files: {
                'public/css/production/travelPage.min.css': [
                    'public/css/travelPage/surya.css',
                    'public/css/travelPage/sarathi.css',
                    'public/css/home/fonts-awesome.css',
                    'public/css/home/flexslider.css',
                    'public/css/home/style4.css',
                    'public/js/jscrollPaneJS/jquery.jscrollpane.css',
                    'public/css/JscrollPaneCSS/ItineraryPanelJscrollPane.css',
                    'public/css/travelPage/map.css',
                    'public/css/global/pageLoader.css',
                    'public/css/global/stickyFooter.css',
                    'public/css/angularCSS/introjs.min.css'
                ]
            }
        },
        hotelsAndPlacesPages: {
            files: {
                'public/css/production/hotelsAndPlacesPage.min.css': [
                    'public/css/bootstrapCSS/angular-timeline.css',
                    'public/css/bootstrapCSS/angular-timeline-bootstrap.css',
                    'public/css/home/fonts-awesome.css',
                    'public/css/hotelsAndPlacesPage/shakuni.css',
                    'public/css/hotelsAndPlacesPage/map.css',
                    'public/css/hotelsAndPlacesPage/cityPanel.css',
                    'public/css/home/inputs.css',
                    'public/css/global/pageLoader.css',
                    'public/css/home/flexslider.css',
                    'public/css/home/style4.css',
                    'public/css/angularCSS/introjs.min.css',
                    'public/js/jscrollPaneJS/jquery.jscrollpane.css',
                    'public/css/JscrollPaneCSS/ItineraryPanelJscrollPane.css',
                    'public/css/global/stickyFooter.css'
                ]
            }
        }
    };
};
