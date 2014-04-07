/*
** Module dependencies
*/
var Person = require('./person');
var Dwelling = require('./dwelling');

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

Situation.prototype.dwelling = function(name) {
    return this.createObject(name, 'dwellings', Dwelling);
};


/*
** Exports
*/
module.exports = Situation;