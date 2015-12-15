'use strict';
import defaults from 'lodash/object/defaults';
import has from 'lodash/object/has';

class HalApi {
  constructor (options) {
    this.options = defaults({
      linkAttr: 'links'
    }, options || {});

    if (!has(this.options, 'endpoint')) {
      throw new Error('missing endpoint property');
    }
  }

  url (path) {
    const { endpoint } = this.options;
    const len = endpoint.length;

    return [
      endpoint.charAt(len - 1) === '/'  ? endpoint.substr(0, len - 1) : endpoint,
      path.charAt(0) === '/' ? path.substring(1) : path
    ].join('/');
  }
}

module.exports = HalApi;
