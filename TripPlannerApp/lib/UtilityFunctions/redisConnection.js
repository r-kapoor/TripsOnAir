/**
 * Created by rkapoor on 23/08/15.
 */

var redis = require("redis");

var client = null;
function getClient(){
    if(client == null){
        client = redis.createClient();
        client.on("error", function (err) {
            console.log("Error Creating REDIS client:" + err);
        });
        client.on('connect', function() {
            console.log('Connected to Redis');
            client.set('itineraryID', 0, function() {
                return client;
            });
        });
    }
    return client;
}

module.exports.getClient = getClient;
