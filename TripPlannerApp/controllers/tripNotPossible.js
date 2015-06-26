/**
 * Created by rkapoor on 27/06/15.
 */
'use strict';

module.exports = function (app) {

    app.get('/tripNotPossible', function (req, res) {
        res.sendfile('./public/templates/layouts/tripNotPossible/tripNotPossibleIndex.html');
    });
};
