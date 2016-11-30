# loopback-set-through-properties-mixin

[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-downloads-url]
[![devDependency Status](https://david-dm.org/JonnyBGod/loopback-set-through-properties-mixin/dev-status.svg)](https://david-dm.org/JonnyBGod/loopback-set-through-properties-mixin#info=devDependencies)
[![Build Status](https://img.shields.io/travis/JonnyBGod/loopback-set-through-properties-mixin/master.svg?style=flat)](https://travis-ci.org/JonnyBGod/loopback-set-through-properties-mixin)

[![MIT license][license-image]][license-url]
[![Gitter Chat](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/loopback-set-through-properties-mixin/Lobby)

##Features

- set though model properties with queries
- use as mixin

##Installation

```bash
npm install loopback-set-through-properties-mixin --save
```

##How to use


Add the mixins property to your server/model-config.json like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../node_modules/loopback-set-through-properties-mixin",
      "../common/mixins"
    ]
  }
}

```

To use with your Models add the mixins attribute to the definition object of your model config.

```json
{
  "name": "app",
  "properties": {
    "name": {
      "type": "string",
    }
  },
  "relations": {
    "users": {
      "type": "hasMany",
      "model": "user",
      "foreignKey": "appId",
      "through": "userRole"
    }
  },
  "mixins": {
    "SetThroughProperties": true,
  }
}
```

Then use in you queries like:

```js
request(server).post('/apps/1/users')
  .send({
    name: 'John',
    email: 'john@gmail.com',
    userRole: {
      type: 'collaborator'
    }
  })
  .expect(200);
```


Example of Through Model:

```json
{
  "name": "userRole",
  "properties": {
    "type": {
      "type": "string",
      "required": true,
      "default": "owner",
      "description": "owner | administrator | collaborator"
    }
  },
  "validations": [],
  "relations": {
    "app": {
      "type": "belongsTo",
      "model": "app",
      "foreignKey": "appId"
    },
    "user": {
      "type": "belongsTo",
      "model": "user",
      "foreignKey": "userId"
    }
  }
}
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/loopback-set-through-properties-mixin.svg
[npm-url]: https://npmjs.org/package/loopback-set-through-properties-mixin
[npm-downloads-image]: https://img.shields.io/npm/dm/loopback-set-through-properties-mixin.svg
[npm-downloads-url]: https://npmjs.org/package/loopback-set-through-properties-mixin
[bower-image]: https://img.shields.io/bower/v/loopback-set-through-properties-mixin.svg
[bower-url]: http://bower.io/search/?q=loopback-set-through-properties-mixin
[dep-status-image]: https://img.shields.io/david/angulartics/loopback-set-through-properties-mixin.svg
[dep-status-url]: https://david-dm.org/angulartics/loopback-set-through-properties-mixin
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE
[slack-image]: https://loopback-set-through-properties-mixin.herokuapp.com/badge.svg
[slack-url]: https://loopback-set-through-properties-mixin.herokuapp.com