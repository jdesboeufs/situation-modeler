situation-modeler
=================

*Work in progress...*

## Documentation

### Usage

```javascript
var modeler = require('situation-modeler')
var situation = modeler();

var paul = situation.person('Paul')
    .set('birthdate', '12/12/1958')
    .set('birthplace', 'Nancy');

var anna = situation.person('Anna')
    .set('birthdate', '07/10/1960')
    .set('birthplace', 'Épinal')
    .marriedTo(paul);

var alex = situation.person('Alex')
    .set('birthdate', '01/01/1995')
    .childOf(paul, anna);

var angela = situation.person('Angela')
    .set('birthdate', '06/07/1990')
    .childOf(paul, anna)
    .occupant('Appartement à Paris', 'tenant', 950);

situation.dwelling('Appartement à Paris')
    .set('type', 'flat')
    .set('postalCode', 75012)
    .set('sharing', true); // House sharing or flat sharing

situation.dwelling('Maison familiale')
    .set('type', 'house')
    .set('postalCode', 54000)
    .ownedBy(paul, anna)
    .defaultDwelling();

situation.incomeSplitting(paul, anna, alex); // Explicit
```

### Person

#### Attributes

| Name | Type  | Notes
| ---- | ----  | ----
| name | `String` |
| birthdate | `Date` | *Can be computed from age*
| age | `Integer` | *Can be computed from birthdate*
| pregnant | `Boolean` |
| student | `Boolean` |
| studentScholarship | `Boolean` |
| retired | `Boolean` |
| maritalStatus | `"single"`<br>`"cohabiting"`<br>`"civil union"`<br>`"married"` |
| maritalPartner | `Person` |
| children | `Array` of `Person` |
| parents | `Array` of `Person` |
| emancipated | `Boolean` |
| detained | `Boolean` |
| hospitalized | `Boolean` |

#### Computed attributes

| Name | Type  | Depends on
| ---- | ----  | ----
| age | `Number` | birthdate
| birthdate | `Date` | age (poor quality)
| minor | `Boolean` | age

### Dwelling

#### Attributes

| Name | Type  | Notes
| ---- | ----  | ----
| type | `"flat"`<br>`"house"`<br>`"room"` |
| sharing | `Boolean` |
| postalCode | `Number` |

### Family

#### Attributes

| Name | Type  | Notes
| ---- | ----  | ----

### Income splitting

#### Attributes

| Name | Type  | Notes
| ---- | ----  | ----

### Household

#### Attributes

| Name | Type  | Notes
| ---- | ----  | ----
