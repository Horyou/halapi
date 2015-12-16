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

  request (url) {}

  resource (path) {
    return Resource.fetch(path, this.options, this.request);
  }
}

module.exports = HalApi;
