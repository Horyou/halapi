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
    if (!fn) {
      throw new Error('Should provide a function');
    }

    Resource.request = fn;
  }

  resource (path) {
    return new Resource(path, this.options);
  }

  // syntactic sugar
  fetch (path) {
    return this.resource(path, this.options).fetch();
  }

  linkAttr () {
    return this.options.linkAttr;
  }
}

HalApi.Resource = Resource;
