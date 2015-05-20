/**
 * Created by rkapoor on 27/03/15.
 */
/*
 * This file shows the admin page helps in editing the database
 */

'use strict';

var getPlaceDetails = require('../lib/admin/getPlaceDetails');
var postPlaceDetails = require('../lib/admin/postPlaceDetails');
var insertPlaceDetails = require('../lib/admin/insertPlaceDetails');
var tasteIntegerToObject = require('../lib/UtilityFunctions/tasteObjectToInteger');
require('date-utils');
var async  = require('async');

module.exports=function (app){

    app.get('/admin/places',function(req,res)
    {
        //Getting the paramters passed
        console.log('In admin/places');
        var placeID = req.param('id');
        getPlaceDetails.getPlaceDetails(placeID, function respondWithPlace(placeObject){
            placeObject.Taste = tasteIntegerToObject.tasteIntegerToObject(placeObject.Taste);
            res.json(placeObject);
        });
    });

    app.post('/admin/places',function(req,res)
    {
        //Getting the paramters passed
        console.log('In admin/places POST');
        var placeDetails = req.param('placeDetails');
        console.log('Place Details:'+JSON.stringify(placeDetails));

        console.log('Taste:'+JSON.stringify(placeDetails.Taste));
        var taste = tasteIntegerToObject.tasteObjectToInteger(placeDetails.Taste);

        placeDetails.Taste = parseInt(taste.tasteInteger | taste.familyFriendsInteger);

        if(placeDetails.Taste == 1023){
            placeDetails.Taste = 0;
        }

        console.log('Taste:'+placeDetails.Taste);

        postPlaceDetails.postPlaceDetails(placeDetails, function responseJSON(model){
            res.json(model);
        });
        //getPlaceDetails.getPlaceDetails(placeID, function respondWithPlace(placeObject){
        //    placeObject.Taste = tasteIntegerToObject.tasteIntegerToObject(placeObject.Taste);
        //    res.json(placeObject);
        //});
    });

    app.post('/admin/newPlace', function(req, res)
    {
        console.log('In admin/newPlaces POST');
        var placeDetails = req.param('placeDetails');
        console.log('Place Details:'+JSON.stringify(placeDetails));

        console.log('Taste:'+JSON.stringify(placeDetails.Taste));
        var taste = tasteIntegerToObject.tasteObjectToInteger(placeDetails.Taste);

        placeDetails.Taste = parseInt(taste.tasteInteger | taste.familyFriendsInteger);

        if(placeDetails.Taste == 1023){
            placeDetails.Taste = 0;
        }

        console.log('Taste:'+placeDetails.Taste);

        insertPlaceDetails.insertPlaceDetails(placeDetails, function responseJSON(model){
            res.json(model);
        })

    });

    app.get('/admin',function(req,res)
    {
        //Getting the paramters passed
        res.sendfile('./public/templates/layouts/admin/index.html');
    });

};



