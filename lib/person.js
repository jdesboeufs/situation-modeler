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
    return moment().diff(this.get('birthdate'), 'years');
};

Person.prototype.getMinor = function() {
    return this.get('age') >= 18;
};

Person.prototype.getLoneParent = function() {
    if (this.get('maritalStatus') !== 'single') return false;
    else return this.get('numChildren') > 0 || this.get('pregnant');
};

Person.prototype.getFamily = function() {
    var parents = [this.id];
    var children = [];

    var maritalStatus = this.get('maritalStatus');
    if (this.get('numChildren') > 0) children = _.union(this.children);

    if (maritalStatus !== 'single') {
        var partner = this.situation.person(this.get('maritalPartner'));
        parents.push(partner.id);
        // if (partner.get('numChildren') > 0) children = _.union(partner.children);
    }

    return { parents: parents, children: children, members: _.union(parents, children) };
};

Person.prototype.getAllFamilyDefined = function() {
    var situation = this.situation;
    var family = this.get('family');
    _.forEach(family.members, function(member) {
        situation.person(member).get('age');
    });
};

Person.prototype.setRelationshipWith = function(otherPerson, type) {
    otherPerson = this.situation.person(otherPerson);
    if (_(['cohabiting', 'civil union', 'married']).contains(type)) {
        this.set('maritalPartner', otherPerson.id);
        this.set('maritalStatus', type);
        otherPerson.set('maritalPartner', this.id);
        otherPerson.set('maritalStatus', type);
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
    firstParent.children.push(this.id);
    return this;
};

Person.prototype.addParent = function(otherPerson) {
    otherPerson = this.situation.person(otherPerson);
    if (this.parents.length >= 2) throw new Error('A person cannot have more than 2 parents');
    this.parents.push(otherPerson.id);
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

Person.prototype.parse = function(data) {
    Entity.prototype.parse.call(this, data);
    this.children = data.children;
    this.parents = data.parents;
};

/*
** Exports
*/
module.exports = Person;
