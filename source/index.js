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

  fetch () {

  }
}

module.exports = HalApi;
