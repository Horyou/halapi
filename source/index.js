'use strict';
import _ from 'lodash';
import Resource from './resource';

export default class HalApi {
  constructor (options) {
    this.options = _.extend({
      linkAttr: 'links'
    }, options || {});

    if (!_.has(this.options, 'endpoint')) {
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
