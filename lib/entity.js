/*
** Module dependencies
*/
var _s = require('underscore.string');
var _ = require('lodash');
var ComputingError = require('./errors').ComputingError;

/*
** Entity
*/
function Entity(options) {
    this.id = options.id;
    this.situation = options.situation;
    this.userAttributes = {};
    this.computedAttributes = {};
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

Entity.prototype.setComputedAttribute = function(name, value) {
    this.computedAttributes[name] = value;
};

Entity.prototype.getComputedAttribute = function(name) {
    return this.computedAttributes[name];
};

Entity.prototype.hasComputedAttribute = function(name) {
    return name in this.computedAttributes;
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
    // Step 1: use user-defined attribute
    if (this.hasUserAttribute(name)) return this.getUserAttribute(name);
    // Step 2: use computed attribute
    if (this.hasComputedAttribute(name)) return this.getComputedAttribute(name);
    // Step 3: compute attribute
    var getterName = 'get' + _s.capitalize(name);
    if ((getterName in this) && _.isFunction(this[getterName])) {
        var result = this[getterName]();
        this.setComputedAttribute(name, result);
        return result;
    }
    // Step 4: throw an exception or return undefined
    if (this.situation.claiming) {
        throw new ComputingError([name], this);
    } else {
        return;
    }

};

Entity.prototype.claim = function(name) {
    try {
        this.situation.claiming = true;
        return this.get(name);
    } catch (e) {
        this.situation.claiming = false;
        throw e;
    }
};

Entity.prototype.read = function(name) {
    try {
        return this.get(name);
    } catch (e) {
        return;
    }
};

Entity.prototype.toJSON = function() {
    var json = { id: this.id };
    json.userAttributes = _.clone(this.userAttributes);
    json.computedAttributes = _.clone(this.computedAttributes);
    return json;
};

Entity.prototype.parse = function(data) {
    _.extend(this, data);
};

/*
** Exports
*/
module.exports = Entity;