/*
** Module dependencies
*/
var Person = require('./person');
var Dwelling = require('./dwelling');
var _ = require('lodash');
var ComputingError = require('./errors').ComputingError;

/*
** Situation
*/
function Situation() {
    this.people = {};
    this.dwellings = {};
    this.families = {};
    this.incomeSplittings = {};
    this.households = {};
}

Situation.prototype.createObject = function(name, collectionName, className) {
    if (!name) name = 'default';
    if (!(name in this[collectionName])) this[collectionName][name] = new className({ id: name, situation: this });
    return this[collectionName][name];
};

Situation.prototype.person = function(personName) {
    if (personName instanceof Person) return personName;
    return this.createObject(personName, 'people', Person);
};

Situation.prototype.dwelling = function(dwellingName) {
    if (dwellingName instanceof Dwelling) return dwellingName;
    return this.createObject(dwellingName, 'dwellings', Dwelling);
};

Situation.prototype.toJSON = function() {
    var json = {};
    json.people = _.map(this.people, function(person) { return person.toJSON(); });
    json.dwellings = _.map(this.dwellings, function(dwelling) { return dwelling.toJSON(); });
    return json;
};

Situation.prototype.import = function(data) {
    var situation = this;
    if (data.people) data.people.forEach(function(person) {
        situation.person(person.id).parse(person);
    });
    if (data.dwellings) data.dwellings.forEach(function(dwelling) {
        situation.dwelling(dwelling.id).parse(dwelling);
    });
};


/*
** Exports
*/
Situation.Person = Person;
Situation.Dwelling = Dwelling;
Situation.ComputingError = ComputingError;
module.exports = Situation;
