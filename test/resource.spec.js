'use strict';
import Resource from '../source/resource';
import test from 'tape';
import has from 'lodash/object/has';
import { isUndefined, isEmpty } from 'lodash/lang';
import { server, apiServer } from './helpers';

test('Resource fetch', (t) => {
  server().then((api) => {
    const result = Resource.fetch('/api', api.options);

    t.equal(typeof result.then, 'function', 'should be a promise');

    result.then((resource) => {
      t.ok(resource instanceof Resource, 'should return a Resource instance');
      t.end();
    });
  });
});

test('Resource data', (t) => {
  server().then((api) => {
    Resource
      .fetch('/api', api.options)
      .then((resource) => {
        t.ok(resource instanceof Resource, 'should return a Resource instance');
        t.equal(resource._data, 'ok', 'resource data should hold the response body');
      });
  });
});

test('Resource links with default `links` attributes', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        const links = resource.links();

        t.ok(has(links, 'self'), 'should have the `self` link');
        t.ok(has(links, 'house'), 'should have the `house` link');
      });
  });
});

test('Resource links with `_links` attributes', (t) => {
  apiServer('resource-_links.json').then((api) => {
    api.options.linkAttr = '_links';

    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        const links = resource.links();

        t.ok(has(links, 'self'), 'should have the `self` link');
        t.ok(has(links, 'house'), 'should have the `house` link');
      });
  });
});

test('Resource unexisting link', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        t.equal(resource.link('home'), null, 'undefined link should be null');
      });
  });
});

test('Resource link', (t) => {
  apiServer('resource-links.json').then((api) => {
    const resource = new Resource('/person/1', api.options);

    resource.fetch()
      .then((person) => {
        const link = person.link('house');

        t.ok(link instanceof Resource, 'link should return a Resource');
        t.equal(link.path(), '/person/1/house', 'should return a promise');
      });
  });
});

test('Resource bad link', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        const link = person.link('badLink');

        t.equal(link, null, 'should not return a promise for a link without href');
      });
  });
});

test('Resource without links', (t) => {
  apiServer('resource-nolinks.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        const link = person.link('foo');

        t.equal(link, null, 'should not return a promise if no links');
      });
  });
});

test('Resource linked resource', (t) => {
  apiServer('resource-links.json').then((api) => {
    const resource = new Resource('/person/1', api.options);

    resource.fetch()
      .then((person) => {
        const link = person.link('house');

        return link.fetch();
      })
      .then((house) => {
        t.ok(house instanceof Resource, 'should resolve a resource');
        t.equal(house.path(), '/person/1/house', 'should have the correct path');

        t.equal(house.data().name, 'The little house', 'should have the correct data');
      });
  });
});

test('Resource: resource helper with a valid link', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource.fetch('/person/1', api.options)
      .then((person) => {
        const link = person.resource('house');

        t.equal(typeof link.then, 'function', 'should return a promise');

        return link;
      })
      .then(value => {
        t.ok(value instanceof Resource, 'link should return a Resource');
        t.equal(value.path(), '/person/1/house', 'should have the correct path');
        t.equal(value.data().name, 'The little house', 'should have been fetched');
      });
  });
});

test('Resource: resource helper with an invalid link', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource.fetch('/person/1', api.options)
      .then((person) => {
        const link = person.resource('houze');

        t.equal(typeof link.then, 'function', 'should return a promise');

        return link;
      })
      .catch(err => {
        t.equal(err.message, 'The resource <houze> does not exists', 'should reject the promise');
      });
  });
});

test('Resource get attribute', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        t.equal(person.get('firstname'), 'John', 'should return field value');
      });
  });
});

test('Resource get wrong attribute', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        t.ok(isUndefined(person.get('firsname')), 'should return undefined');
      });
  });
});

test('Resource: get attribute of a linked resource', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        return person.link('house').fetch();
      })
      .then((house) => {
        t.equal(house.get('name'), 'The little house', 'should return the linked field value');
      });
  });
});

test('Resource: data fields', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        const data = person.data();

        t.ok(!has(data, api.options.linkAttr), 'should not export links property');
      });
  });
});

test('Resource: response data', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        t.equal(resource.json(), resource._data, 'fetched data should be exported using json()');
      });
  });
});

test('Resource: request path', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((person) => {
        t.equal(person.path(), '/person/1', 'should export request path');
      });
  });
});

test('Resource: url', (t) => {
  apiServer('resource-links.json').then((api) => {
    Resource
      .fetch('/person/1', api.options)
      .then((resource) => {
        const endpoint = resource.options.endpoint;

        t.equal(resource.url(), endpoint + '/person/1', 'should return the absolute url using url()');
      });
  });
})

test('Resource: fetch', (t) => {
  apiServer('resource-links.json').then((api) => {
    const resource = new Resource('/person/1', api.options);

    t.ok(isEmpty(resource.data()), 'body should not be set before fetch');

    resource.fetch().then((res) => {
      t.ok(res instanceof Resource, 'should return a Resource');
      t.equal(resource, res, 'should return the resource');

      const data = resource.data();

      t.equal(data.firstname, 'John', 'body should be set after fetch');
    });
  });
});

test('Resource: save', (t) => {
  const resource = new Resource('/foo');

  t.ok(isEmpty(resource.data()), 'body should not be set before fetch');

  t.ok(resource.save() === resource, 'should return the resource for chaining');

  resource.save({ foo: 'bar' });

  t.equal(resource.data(), { foo: 'bar' }, 'should save the data');

  t.end();
});
