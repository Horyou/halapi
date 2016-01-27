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

  server().then((api) => {
    const result = api.resource('/api');

    t.equal(typeof result.then, 'function');
    result.then((resource) => {
      t.ok(resource instanceof Resource, 'should received a resource');

      t.end();
    });
  });
});
