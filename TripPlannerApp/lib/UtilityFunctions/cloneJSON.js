function clone(a) {
   return JSON.parse(JSON.stringify(a));
}
module.exports.clone = clone;
