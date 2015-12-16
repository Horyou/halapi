'use strict';
import Halapi from '../source';
import test from 'tape';
import { has, get } from 'lodash/object';
import server from './helpers';

test('Halapi default options', (t) => {
  t.plan(4);

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
});

test('Halapi request', (t) => {
  t.plan(2);

  server().then((api) => {
    const result = api.request('/api');

    t.equal(typeof result.then, 'function');

    result.then((response) => {
      t.equal(response.body, 'ok');
      t.end();
    });
  });
});
