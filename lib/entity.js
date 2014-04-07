/*
** Module dependencies
*/
var _s = require('underscore.string');
var _ = require('lodash');

/*
** Entity
*/
function Entity(options) {
    this.id = options.id;
    this.situation = options.situation;
    this.userAttributes = {};
}

/*
** Prototype
*/
Entity.prototype.setUserAttribute = function(name, value) {
    this.userAttributes[name] = value;
};

Entity.prototype.getUserAttribute = function(name) {
    return this.userAttributes[name];
};

Entity.prototype.hasUserAttribute = function(name) {
    return name in this.userAttributes;
};

Entity.prototype.set = function(name, value) {
    // Batch set
    if (_.isObject(name)) {
        _.forEach(name, function(value, name) {
            this.set(name, value);
        }, this);
        return this;
    }

    // Step 1: use build-in accessor
    var setterName = 'set' + _s.capitalize(name);
    if ((setterName in this) && _.isFunction(this[setterName])) this[setterName](value);
    // Step 2: set as user-defined attributes
    else this.setUserAttribute(name, value);
    return this;
};

Entity.prototype.get = function(name) {
    // Step 1: use user-defined attributes
    if (this.hasUserAttribute(name)) return this.getUserAttribute(name);
    // Step 2: use build-in accessor
    var getterName = 'get' + _s.capitalize(name);
    if ((getterName in this) && _.isFunction(this[getterName])) return this[getterName]();
};

/*
** Exports
*/
module.exports = Entity;