'use strict';

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.sendfile('./public/templates/index.html');
    });
};
