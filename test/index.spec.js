'use strict';
import Halapi from '../source';
import test from 'tape';
import { has, get } from 'lodash/object';
import { server } from './helpers';
import Resource from '../source/resource';

test('Halapi default options', (t) => {
  t.throws(() => {
    const api = new Halapi();
  }, 'missing endpoint property', 'should throw if no endpoint property');

  const endpoint = 'foo';
  const api = new Halapi({
    endpoint: endpoint
  });

  t.ok(has(api.options, 'linkAttr'), 'linkAttr should be defined');
  t.equal(get(api.options, 'linkAttr'), 'links', 'linkAttr should equal `links`');
  t.equal(get(api.options, 'endpoint'), endpoint, 'should have endpoint option');

  t.end();
});

// test('Halapi request', (t) => {
//   t.plan(1);
//
//   server().then((api) => {
//     const result = api.request('/api');
//
//     t.equal(typeof result.then, 'function');
//   });
// });

test('Halapi resource', (t) => {
  const api = new Halapi({
    endpoint: 'foo'
  });
  const resource = api.resource('/api');

  t.ok(resource instanceof Resource, 'should received a resource');
  t.equal(resource.path(), '/api', 'should received a resource');

  t.end();
});

test('Halapi fetch', (t) => {
  server().then((api) => {
    const result = api.fetch('/api');

    t.equal(typeof result.then, 'function', 'should be a promise');
    return result.then((resource) => {
      t.ok(resource instanceof Resource, 'should received a resource');

      t.end();
    });
  });
});


test('Halapi linkAttr', (t) => {
  const api = new Halapi({
    endpoint: 'foo'
  });
  const linkAttr = api.linkAttr();

  t.ok(linkAttr === 'links', 'should return the default value for linkAttr');
  t.end();
});

test('Halapi linkAttr', (t) => {
  const api = new Halapi({
    endpoint: 'foo',
    linkAttr: '__foo__'
  });
  const linkAttr = api.linkAttr();

  t.ok(linkAttr === '__foo__', 'should return the provided value for linkAttr');
  t.end();
});
