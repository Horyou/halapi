'use strict';
import utils from '../source/utils';
import test from 'tape';

test('Utils url', (t) => {
  t.test('test with endpoint terminating with a slash', (nt) => {
    const expected = 'http://localhost/api';

    nt.equal(utils.url('http://localhost/', '/api'), expected, 'url should not have duplicate `/` for path');
    nt.equal(utils.url('http://localhost/', 'api'), expected, 'url should not have duplicate `/` for path');

    nt.end();
  });

  t.test('test with endpoint not terminating with a slash', (nt) => {
    const expected = 'http://localhost/api';

    nt.equal(utils.url('http://localhost', '/api'), expected, 'url should not have duplicate `/` for path');
    nt.equal(utils.url('http://localhost', 'api'), expected, 'url should not have duplicate `/` for path');

    nt.end();
  });
});
