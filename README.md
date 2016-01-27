# halapi [![Build Status](https://travis-ci.org/stephanebachelier/halapi.svg?branch=master)](https://travis-ci.org/stephanebachelier/halapi) [![Coverage Status](https://coveralls.io/repos/github/stephanebachelier/halapi/badge.svg?branch=master)](https://coveralls.io/github/stephanebachelier/halapi?branch=master)

> My node module


## Install

In Browser:
```
$ bower install --save halapi
```


In Node:
```
$ npm install --save halapi
```

## Usage

Given the API response:
```js
{
  id: 1,
  firstname: 'John',
  lastname: 'Bar',
  links: {
    self: {
      href: '/person/1'
    },
    house: {
      href: '/person/1/house'
    },
    children: {
      href: '/person/1/children'
    }
  }
}
```

You must create the wrapper using the `halapi`, as below:
```js
var api = new halapi({
  endpoint: 'http://foo.tld/bar'
});
```

`halapi` does not make the request by itself. Should you want to use `$.ajax`, `superagent`
for the browser or `request`, `got` in node, it's up to you.

You must provide your own function that must follow this API:

```js
var request = function (url) {
  return new Promise(function (resolve, reject) {
    // do what you want here !
  });
});

api.request(request);
```

You can now request any resource using the `api.fetch` method
```js
api.fetch('/person/1');
api.fetch('/person/1/house');
```

The `api.fetch` return a promise which will return a `halapi.Resource` when resolved.

```js
api.fetch('/person/1').then(function (john) {
  // john is an instance of halapi.Resource
})
```

To retrieve a linked resource from an existing resource, it's as simple as:
```js
john.link('house').then(function (house) {
  // house is an instance of halapi.Resource
})
```

The `halapi.Resource` is not exported as it is easily accessible using `api.fetch`.

The `halapi.Resource` has a simple API:

* `data()`: return only the data part of the response, without the `links` property
* `get(name)`: return the data property `name`
* `links()`: return the links property
* `link(name)`: return a promise to fetch the resource for the given `name` link
* `save(data)`: replace the content of the resource. Normally you should not need to use this.
* `linkAttr`: if you need to override the default value (`links`) for the link property

## A small example below:

Given both the reponses for:

the resource `/person/1`:
```json
{
  "id": 1,
  "firstname": "John",
  "lastname": "Foo",
  "links": {
    "self": {
      "href": "/person/1"
    },
    "house": {
      "href": "/person/1/house"
    }
  }
}
```

And the resource `/person/1/house`:
```json
{
  "hid": 123,
  "name": "The little house",
  "links": {
    "self": {
      "href": "/person/1/house"
    },
    "address": {
      "href": "/house/1/address"
    },
    "badLink": {}
  }
}
```

```js
api.fetch('/person/1').then(function (person) {
  person.get('firstname'); // John

  person.links();
  /*
  {
    "self": {
      "href": "/person/1"
    },
    "house": {
      "href": "/person/1/house"
    }
  }
  */

  person.link('house').then(function (house) {
    house.data();
    /*
    {
      "hid": 123,
      "name": "The little house"
    }
    */

    // this should not be needed.
    // Beware that it's the whole server response and as such you should provide
    // the links property
    house.save({
      hid: 124,
      name: "My little house"
    });

    house.data(); // will return the same data which where saved
    house.links(); // undefined because no links where provided.
  })
});

```

## License

MIT © [Stéphane Bachelier](https://github.com/stephanebachelier)
