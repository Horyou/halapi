'use strict';
import utils from '../source/utils';
import test from 'tape';

test('Utils url', (t) => {
  t.test('test with endpoint terminating with a slash', (nt) => {
    nt.plan(2);

    nt.equal(utils.url('http://localhost/', '/api'), 'http://localhost/api');
    nt.equal(utils.url('http://localhost/', 'api'), 'http://localhost/api');
  });

  t.test('test with endpoint not terminating with a slash', (nt) => {
    nt.plan(2);

    nt.equal(utils.url('http://localhost', '/api'), 'http://localhost/api');
    nt.equal(utils.url('http://localhost', 'api'), 'http://localhost/api');
  });
});
