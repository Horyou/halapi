import Resource from '../source/resource';
import test from 'blue-tape';

const request = Resource.request;

const setup = response => {
  Resource.request = () => {
    return Promise.resolve(response || { foo: 'bar' });
  }
}

const teardown = () => {
  Resource.request = request;
}

const asyncTest = (name, fn) => test(name, (t => new Promise(resolve => {
  fn(t, setup, () => {
    teardown();
    resolve();
  });
}).catch(e => {
  throw e;
})));

export default asyncTest;
