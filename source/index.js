'use strict';
import defaults from 'lodash/object/defaults';
import has from 'lodash/object/has';
import Resource from './resource';

class HalApi {
  constructor (options) {
    this.options = defaults({
      linkAttr: 'links'
    }, options || {});

    if (!has(this.options, 'endpoint')) {
      throw new Error('missing endpoint property');
    }
  }

  request (fn) {
    if (fn) {
      Resource.request = fn;
    }
  }

  resource (path) {
    return Resource.fetch(path, this.options);
  }
}

module.exports = HalApi;
