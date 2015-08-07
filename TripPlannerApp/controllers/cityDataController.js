/**
 * Created by rajat on 8/7/2015.
 */

var populateCityDataService = require('../lib/UtilityFunctions/populateCityDataService');

module.exports=function (app) {

    app.get('/cityList', function (req, res) {
        //Getting the paramters passed
        console.log('In city');
        populateCityDataService.populateCityDataService(function respondWithCity(cityObject) {
            res.json(cityObject);
        });
    });
};
