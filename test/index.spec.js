'use strict';
import Halapi from '../source';
import Resource from '../source/resource';
import asyncTest from './async-test';
import test from 'tape';

import { has, get } from 'lodash/object';

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

test('Halapi request', (t) => {
  const api = new Halapi({ endpoint: 'foo' });

  t.throws(() => {
    api.fetch('/foo/bar')
  }, 'Should provide a function', 'should throw if request has no function');

  t.end();
});

test('Halapi request', (t) => {
  const api = new Halapi({ endpoint: 'foo' });
  const fn = function () {
    return 'foo';
  }

  api.request(fn);

  t.ok(Resource.request === fn, 'should add function to Resource');

  t.end();
});

asyncTest('Halapi fetch', (t, before, done) => {
  before();

  const api = new Halapi({ endpoint: 'foo' });
  const result = api.fetch('/api');

  t.equal(typeof result.then, 'function', 'should be a promise');

  result.then(resource => {
    t.ok(resource instanceof Resource, 'should received a resource');

    done();
  });
});

test('Halapi resource', (t) => {
  const api = new Halapi({ endpoint: 'foo' });
  const resource = api.resource('/api');

  t.ok(resource instanceof Resource, 'should received a resource');
  t.equal(resource.path(), '/api', 'should have the correct path');

  t.end();
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
