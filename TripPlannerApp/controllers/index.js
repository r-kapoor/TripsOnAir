'use strict';

module.exports = function (app) {

    var MobileDetect = require('mobile-detect');
    app.get('/', function (req, res) {
        var md = new MobileDetect(req.headers['user-agent']);
        if(md.mobile() == null){
            res.sendfile('./public/templates/index.html');
        }
        else {
            res.sendfile('./public/templates/layouts/mobile/mobileIndex.html');
        }
    });
};
