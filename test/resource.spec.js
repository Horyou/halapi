'use strict';
import Resource from '../source/resource';
import test from 'tape';
import has from 'lodash/object/has';
import { server, fixtures } from './helpers';
import got from 'got';

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

test('Resource links with default `links` attributes', (t) => {
  t.plan(2);

  fixtures('resource-links.json').then((data) => {
    server(data.routes).then((api) => {
      /* override to force json */
      api.request = (url) => {
        return got(url, { json: true });
      };

      Resource
        .fetch('/person/1', api.options, api.request)
        .then((resource) => {
          const links = resource.links();

          t.ok(has(links, 'self'), 'should have the `self` link');
          t.ok(has(links, 'house'), 'should have the `house` link');
        });
    });
  });
});

test('Resource links with default `_links` attributes', (t) => {
  t.plan(2);

  fixtures('resource-_links.json').then((data) => {
    server(data.routes).then((api) => {
      /* override to force json */
      api.request = (url) => {
        return got(url, { json: true });
      };

      api.options.linkAttr = '_links';

      Resource
        .fetch('/person/1', api.options, api.request)
        .then((resource) => {
          const links = resource.links();

          t.ok(has(links, 'self'), 'should have the `self` link');
          t.ok(has(links, 'house'), 'should have the `house` link');
        });
    });
  });
});
