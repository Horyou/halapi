'use strict';
import Resource from '../source/resource';
import test from 'tape';
import server from './helpers';

test('Resource fetch', (t) => {
  t.plan(2);

  server().then((api) => {
    const result = Resource.fetch('/api', api.options, api.request);

    t.equal(typeof result.then, 'function', 'should be a promise');

    result.then((resource) => {
      t.ok(resource instanceof Resource, 'should return a Resource instance');
    });
  });
});

test('Resource data', (t) => {
  t.plan(2);

  server().then((api) => {
    Resource
      .fetch('/api', api.options, api.request)
      .then((resource) => {
        t.ok(resource instanceof Resource, 'should return a Resource instance');
        t.equal(resource._data, 'ok', 'resource data should hold the response body');
      });
  });
});
