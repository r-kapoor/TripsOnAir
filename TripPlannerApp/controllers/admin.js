/**
 * Created by rkapoor on 27/03/15.
 */
/*
 * This file shows the admin page helps in editing the database
 */

'use strict';

var getPlaceDetails = require('../lib/admin/getPlaceDetails');
var getCrawledPlaceDetails = require('../lib/admin/getCrawledPlaceDetails');
var postPlaceDetails = require('../lib/admin/postPlaceDetails');
var insertPlaceDetails = require('../lib/admin/insertPlaceDetails');
var tasteIntegerToObject = require('../lib/UtilityFunctions/tasteObjectToIntegerAdmin');
require('date-utils');
var async  = require('async');

module.exports=function (app){

    app.get('/addorchangeplace/places',function(req,res)
    {
        //Getting the paramters passed
        console.log('In admin/places');
        var placeID = req.param('id');
        getPlaceDetails.getPlaceDetails(placeID, function respondWithPlace(placeObject){
            if(placeObject != undefined){
                placeObject.Taste = tasteIntegerToObject.tasteIntegerToObject(placeObject.Taste);
            }
            res.json(placeObject);
        });
    });

    app.post('/addorchangeplace/places',function(req,res)
    {
        //Getting the paramters passed
        console.log('In admin/places POST');
        var placeDetails = req.param('placeDetails');
        console.log('Place Details:'+JSON.stringify(placeDetails));

        console.log('Taste:'+JSON.stringify(placeDetails.Taste));
        var taste = tasteIntegerToObject.tasteObjectToInteger(placeDetails.Taste);

        placeDetails.Taste = parseInt(taste.tasteInteger | taste.familyFriendsInteger);

        if(placeDetails.Taste == 16383){
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

    app.post('/addorchangeplace/newPlace', function(req, res)
    {
        console.log('In admin/newPlaces POST');
        var placeDetails = req.param('placeDetails');
        console.log('Place Details:'+JSON.stringify(placeDetails));

        console.log('Taste:'+JSON.stringify(placeDetails.Taste));
        var taste = tasteIntegerToObject.tasteObjectToInteger(placeDetails.Taste);

        placeDetails.Taste = parseInt(taste.tasteInteger | taste.familyFriendsInteger);

        if(placeDetails.Taste == 16383){
            placeDetails.Taste = 0;
        }

        console.log('Taste:'+placeDetails.Taste);

        insertPlaceDetails.insertPlaceDetails(placeDetails, function responseJSON(model){
            res.json(model);
        })

    });

    app.get('/addorchangeplace/newPlace', function(req, res)
    {
        console.log('In GET admin/newPlaces');
        var placeObject = {};
        placeObject.Taste = tasteIntegerToObject.tasteIntegerToObject(0);
        res.json(placeObject);
    });

    app.get('/addorchangeplace',function(req,res)
    {
        //Getting the paramters passed
        res.sendfile('./public/templates/layouts/admin/index.html');
    });

    app.get('/addorchangeplace/crawledPlaces', function(req, res){
        var placeID = req.param('id');
        getCrawledPlaceDetails.getCrawledPlaceDetails(placeID, function respondWithPlace(placeObject){
            if(placeObject != undefined){
                placeObject.Taste = tasteIntegerToObject.tasteIntegerToObject(placeObject.Taste);
            }
            res.json(placeObject);
        });
    });

};



