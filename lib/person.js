/*
** Module dependencies
*/
var Entity = require('./entity');
var _ = require('lodash');
var moment = require('moment');

/*
** Person
*/
function Person(options) {
    Entity.call(this, options);
    this.parents = [];
    this.children = [];
}

/*
** Inheritance
*/
Person.prototype = _.create(Entity.prototype, { constructor: Person });

/*
**  Attributes
*/
Person.prototype.setBirthdate = function(newValue) {
    this.setUserAttribute('birthdate', moment(newValue));
};

Person.prototype.getAge = function() {
    var birthdate = this.get('birthdate');
    if (!birthdate) throw new Error('Unable to compute `age` attribute');
    return moment().diff(birthdate, 'years');
};

Person.prototype.getMinor = function() {
    var age = this.get('age');
    if (!age) throw new Error('Unable to compute `minor` attribute');
    return age >= 18;
};

Person.prototype.setRelationshipWith = function(otherPerson, type) {
    otherPerson = this.situation.person(otherPerson);
    if (_(['cohabiting', 'civil union', 'married']).contains(type)) {
        this.set('maritalStatus', type);
        this.set('maritalPartner', otherPerson);
        otherPerson.set('maritalStatus', type);
        otherPerson.set('maritalPartner', this);
    }
    return this;
};

Person.prototype.marriedTo = function(otherPerson) {
    return this.setRelationshipWith(otherPerson, 'married');
};

Person.prototype.inCivilUnionWith = function(otherPerson) {
    return this.setRelationshipWith(otherPerson, 'civil union');
};

Person.prototype.cohabitingWith = function(otherPerson) {
    return this.setRelationshipWith(otherPerson, 'cohabiting');
};

Person.prototype.childOf = function(firstParent, secondParent) {
    if (secondParent) this.childOf(secondParent);
    firstParent = this.situation.person(firstParent);
    this.addParent(firstParent);
    firstParent.children.push(this);
    return this;
};

Person.prototype.addParent = function(otherPerson) {
    otherPerson = this.situation.person(otherPerson);
    if (this.parents.length >= 2) throw new Error('A person cannot have more than 2 parents');
    this.parents.push(otherPerson);
};

Person.prototype.occupant = function(dwelling, occupancyStatus) {
    dwelling = this.situation.dwelling(dwelling);
    this.set('home', dwelling.id);
    this.set('occupancyStatus', occupancyStatus);
    dwelling.addOccupant(this);
    return this;
};

Person.prototype.toJSON = function() {
    var json = Entity.prototype.toJSON.call(this);
    json.children = this.children;
    json.parents = this.parents;
    return json;
};

/*
** Exports
*/
module.exports = Person;
