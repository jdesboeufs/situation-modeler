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
    this.attributes = {};
}

/*
** Prototype
*/
Entity.prototype.setAttribute = function(name, value, method) {
    if (!(name in this.attributes)) {
        this.attributes[name] = {};
    }

    this.attributes[name].value = value;
    this.attributes[name].method = method;
}

Entity.prototype.setUserAttribute = function(name, value) {
    this.setAttribute(name, value, 'user');
};

Entity.prototype.setComputedAttribute = function(name, value) {
    this.setAttribute(name, value, 'computed');
};

Entity.prototype.getAttribute = function(name) {
    return this.attributes[name];
}

Entity.prototype.getUserAttribute = function(name) {
    var attribute = this.getAttribute(name);
    if (attribute.method === 'user') return attribute.value;
};

Entity.prototype.getComputedAttribute = function(name) {
    var attribute = this.getAttribute(name);
    if (attribute.method === 'computed') return attribute.value;
};

Entity.prototype.hasAttribute = function(name) {
    return name in this.attributes;
};

Entity.prototype.hasUserAttribute = function(name) {
    return this.hasAttribute(name) && this.getAttribute(name).method === 'user';
};

Entity.prototype.hasComputedAttribute = function(name) {
    return this.hasAttribute(name) && this.getAttribute(name).method === 'computed';
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
    // Step 1: use existing attribute
    if (this.hasAttribute(name)) return this.getAttribute(name).value;
    // Step 2: compute attribute
    var getterName = 'get' + _s.capitalize(name);
    if ((getterName in this) && _.isFunction(this[getterName])) {
        var result = this[getterName]();
        this.setComputedAttribute(name, result);
        return result;
    }
    // Step 3: throw an exception or return undefined
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
    json.attributes = _.mapValues(this.attributes, function(attribute) { return attribute.value; });
    json.userAttributes = {};
    json.computedAttributes = {};
    _.forEach(this.attributes, function(attribute, name) {
        if (attribute.method === 'computed') {
            json.computedAttributes[name] = true;
        } else {
            json.userAttributes[name] = true;
        }
    });
    return json;
};

Entity.prototype.parse = function(data) {
    var entity = this;
    var computedAttributes = data.computedAttributes || {};
    if (data.attributes) {
        _.forEach(data.attributes, function(value, name) {
            entity.setAttribute(name, value, computedAttributes[name] ? 'computed' : 'user');
        });
    }
};

/*
** Exports
*/
module.exports = Entity;