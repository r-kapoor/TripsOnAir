/**
 * Created by rkapoor on 23/08/15.
 */

var redis = require("redis");
var config = require("config");
var client = null;
function getClient(){

    if(client == null){
        client = redis.createClient(6379, config.get('redis-host'), {});
        //client = redis.createClient();
        client.on("error", function (err) {
            console.log("Error Creating REDIS client:" + err);
        });
        client.on('connect', function() {
            console.log('Connected to Redis');
            client.get('itineraryID', function(err, value) {
                if (err || value == null) {
                    client.set('itineraryID', 0, function() {
                        return client;
                    });
                }
                else{
                    return client;
                }
            });
        });
    }
    return client;
}

module.exports.getClient = getClient;
