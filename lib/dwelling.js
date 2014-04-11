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
    this.occupants = [];
}

/*
** Inheritance
*/
Dwelling.prototype = _.create(Entity.prototype, { constructor: Dwelling });

/*
**  Attributes
*/
Dwelling.prototype.addOccupant = function(occupant) {
    occupant = this.situation.person(occupant);
    this.occupants.push(occupant);
    return this;
};

Dwelling.prototype.toJSON = function() {
    var json = Entity.prototype.toJSON.call(this);
    json.occupants = this.occupants;
    return json;
};

/*
** Exports
*/
module.exports = Dwelling;
