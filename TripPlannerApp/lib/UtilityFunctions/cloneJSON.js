var EJSON = require('ejson');
require('date-utils');
function clone(a) {
    return EJSON.parse(EJSON.stringify(a));
   //return JSON.parse(JSON.stringify(a));
}
module.exports.clone = clone;

function test() {
    var obj = {
        name: 'Name',
        dateObj: new Date(2015, 0, 1)
    };
    var obj1 = clone(obj);
    console.log(obj.dateObj.getHours());
    console.log(obj1.dateObj.getHours());
    obj1.dateObj.addHours(5);
    console.log(obj1.dateObj.getHours());
    console.log(obj.dateObj.getHours());
}
//test();
