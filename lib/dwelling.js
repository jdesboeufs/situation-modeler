/*
** Module dependencies
*/
var Entity = require('./entity');
var _ = require('lodash');

/*
** Dwelling
*/
function Dwelling(options) {
    Entity.call(this, options);
}

/*
** Inheritance
*/
Dwelling.prototype = _.create(Entity.prototype, { constructor: Dwelling });

/*
** Exports
*/
module.exports = Dwelling;
