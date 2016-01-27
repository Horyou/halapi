'use strict';
import Resource from '../source/resource';
import asyncTest from './async-test';

import has from 'lodash/object/has';
import { isUndefined, isEmpty } from 'lodash/lang';


asyncTest('Resource fetch', (t, before, done) => {
  before();
  t.comment('test');
  const result = Resource.fetch('/api', { endpoint: 'foo' });

  t.equal(typeof result.then, 'function', 'should be a promise');

  result.then(resource => {
    t.ok(resource instanceof Resource, 'should return a Resource instance');

    done();
  });
});

asyncTest('Resource data', (t, before, done) => {
  before({ body: 'ok' });

  Resource.fetch('/api', { endpoint: 'foo' })
    .then((resource) => {
      t.ok(resource instanceof Resource, 'should return a Resource instance');
      t.equal(resource._data, 'ok', 'resource data should hold the response body');

      done();
    });
});

asyncTest('Resource links with default `links` attributes', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource
    .fetch('/person/1', { endpoint: 'foo' })
    .then(resource => {
      const links = resource.links();

      t.ok(has(links, 'self'), 'should have the `self` link');
      t.ok(has(links, 'house'), 'should have the `house` link');

      done();
    });
});

asyncTest('Resource links with `_links` attributes', (t, before, done) => {
  before({ body: require('./fixtures/response/person-_links.json') });

  const options = {
    endpoint: 'foo',
    linkAttr: '_links'
  };

  Resource
    .fetch('/person/1', options)
    .then((resource) => {
      const links = resource.links();

      t.ok(has(links, 'self'), 'should have the `self` link');
      t.ok(has(links, 'house'), 'should have the `house` link');

      done();
    });
});

asyncTest('Resource unexisting link', (t, before, done) => {
  before({ body: require('./fixtures/response/person-nolinks.json') });

  Resource
    .fetch('/person/1', { endpoint: 'foo' })
    .then((resource) => {
      t.equal(resource.link('home'), null, 'undefined link should be null');

      done();
    });
});

asyncTest('Resource hasLink', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  const resource = new Resource('/person/1', { endpoint: 'foo' });

  resource.fetch()
    .then((person) => {
      t.ok(person.hasLink('house'), 'should tell `house` link exists');
      t.notOk(person.hasLink('houze'), 'should tell `houze` link does not exist');

      done();
    });
});


asyncTest('Resource link', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  const resource = new Resource('/person/1', { endpoint: 'foo' });

  resource.fetch()
    .then((person) => {
      const link = person.link('house');

      t.ok(link instanceof Resource, 'link should return a Resource');
      t.equal(link.path(), '/person/1/house', 'should return a promise');

      done();
    });
});

asyncTest('Resource bad link', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource
    .fetch('/person/1', { endpoint: 'foo' })
    .then((person) => {
      const link = person.link('badLink');

      t.equal(link, null, 'should not return a promise for a link without href');

      done();
    });
});

asyncTest('Resource without links', (t, before, done) => {
  before({ body: require('./fixtures/response/person-nolinks.json') });

  Resource
    .fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      const link = person.link('foo');

      t.equal(link, null, 'should not return a promise if no links');

      done();
    });
});

asyncTest('Resource linked resource', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  const resource = new Resource('/person/1', { endpoint: '/foo' });

  resource.fetch()
    .then((person) => {
      const link = person.link('house');

      before({ body: require('./fixtures/response/house.json') });

      return link.fetch();
    })
    .then((house) => {
      t.ok(house instanceof Resource, 'should resolve a resource');
      t.equal(house.path(), '/person/1/house', 'should have the correct path');

      t.equal(house.data().name, 'The little house', 'should have the correct data');

      done();
    });
});

asyncTest('Resource: resource helper with a valid link', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      before({ body: require('./fixtures/response/house.json') });

      const link = person.resource('house');

      t.equal(typeof link.then, 'function', 'should return a promise');

      return link;
    })
    .then(value => {
      t.ok(value instanceof Resource, 'link should return a Resource');
      t.equal(value.path(), '/person/1/house', 'should have the correct path');
      t.equal(value.data().name, 'The little house', 'should have been fetched');

      done();
    });
});

asyncTest('Resource: resource helper with an invalid link', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      const link = person.resource('houze');

      t.equal(typeof link.then, 'function', 'should return a promise');

      return link;
    })
    .catch(err => {
      t.equal(err.message, 'The resource <houze> does not exists', 'should reject the promise');

      done();
    });
});

asyncTest('Resource get attribute', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      t.equal(person.get('firstname'), 'John', 'should return field value');

      done();
    });
});

asyncTest('Resource get wrong attribute', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      t.ok(isUndefined(person.get('firsname')), 'should return undefined');

      done();
    });
});

asyncTest('Resource: get attribute of a linked resource', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      before({ body: require('./fixtures/response/house.json') });

      return person.link('house').fetch();
    })
    .then((house) => {
      t.equal(house.get('name'), 'The little house', 'should return the linked field value');

      done();
    });
});

asyncTest('Resource: data fields', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      const data = person.data();

      t.ok(!has(data, 'links'), 'should not export links property');

      done();
    });
});

asyncTest('Resource: response data', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((resource) => {
      t.equal(resource.json(), resource._data, 'fetched data should be exported using json()');

      done();
    });
});

asyncTest('Resource: request path', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((person) => {
      t.equal(person.path(), '/person/1', 'should export request path');

      done();
    });
});

asyncTest('Resource: url', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  Resource.fetch('/person/1', { endpoint: '/foo' })
    .then((resource) => {
      const endpoint = resource.options.endpoint;

      t.equal(resource.url(), endpoint + '/person/1', 'should return the absolute url using url()');

      done();
    });
})

asyncTest('Resource: fetch', (t, before, done) => {
  before({ body: require('./fixtures/response/person.json') });

  const resource = new Resource('/person/1', { endpoint: '/foo' })

  t.ok(isEmpty(resource.data()), 'body should not be set before fetch');

  resource.fetch().then((res) => {
    t.ok(res instanceof Resource, 'should return a Resource');
    t.equal(resource, res, 'should return the resource');

    const data = resource.data();

    t.equal(data.firstname, 'John', 'body should be set after fetch');

    done();
  });
});

asyncTest('Resource: save', (t, before, done) => {
  const resource = new Resource('/foo');

  t.ok(isEmpty(resource.data()), 'body should not be set before fetch');

  t.ok(resource.save() === resource, 'should return the resource for chaining');

  resource.save({ foo: 'bar' });

  t.deepEqual(resource.data(), { foo: 'bar' }, 'should save the data');

  done();
});
