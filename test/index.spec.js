'use strict';
import Halapi from '../source';
import test from 'tape';
import { has, get } from 'lodash/object';
import { createServer } from './_server';
import got from 'got';

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

test('Halapi url', (t) => {
  t.test('test with endpoint terminating with a slash', (nt) => {
    nt.plan(2);

    const api = new Halapi({
      endpoint: 'http://localhost/'
    });

    nt.equal(api.url('/api'), 'http://localhost/api');
    nt.equal(api.url('api'), 'http://localhost/api');
  });

  t.test('test with endpoint not terminating with a slash', (nt) => {
    nt.plan(2);

    const api = new Halapi({
      endpoint: 'http://localhost'
    });

    nt.equal(api.url('/api'), 'http://localhost/api');
    nt.equal(api.url('api'), 'http://localhost/api');
  });
});

test('Halapi request', (t) => {
  t.plan(2);

  const request = function (path) {
    return got(this.url(path));
  };

  createServer().then((s) => {
    s.on('/api', (req, res) => {
      res.end('ok');
    });

    s.listen(s.port);

    const api = new Halapi({
      endpoint: s.url
    });

    api.request = request.bind(api);

    const result = api.request('/api');

    t.equal(typeof result.then, 'function');

    result.then((response) => {
      t.equal(response.body, 'ok');
      t.end();
    });
  });
});
