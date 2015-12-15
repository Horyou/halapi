'use strict';
import Halapi from '../source';
import test from 'tape';

test('Halapi', (t) => {
  t.plan(1);

  const api = new Halapi();
  t.equal(typeof api.fetch, 'function');
});
