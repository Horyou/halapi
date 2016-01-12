(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
  typeof define === 'function' && define.amd ? define(['lodash'], factory) :
  global.halapi = factory(global._);
}(this, function (_) { 'use strict';

  _ = 'default' in _ ? _['default'] : _;

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  babelHelpers;
  var utils = {
    url: function url(endpoint, path) {
      var len = endpoint.length;

      return [endpoint.charAt(len - 1) === '/' ? endpoint.substr(0, len - 1) : endpoint, path.charAt(0) === '/' ? path.substring(1) : path].join('/');
    }
  };

  var Resource = (function () {
    babelHelpers.createClass(Resource, null, [{
      key: 'request',
      value: function request(url) {
        throw new Error('Not implemented');
      }
    }, {
      key: 'fetch',
      value: function fetch(path, options) {
        var endpoint = options.endpoint;

        var url = utils.url(endpoint, path);

        return Resource.request(url).then(function (response) {
          var resource = new Resource(path, options);

          resource.save(response.body);
          return resource;
        });
      }
    }]);

    function Resource(path, options) {
      babelHelpers.classCallCheck(this, Resource);

      this._path = path;
      this.options = options;
      this.linkAttr = options.linkAttr || 'links';
    }

    babelHelpers.createClass(Resource, [{
      key: 'save',
      value: function save(body) {
        this._data = body;
      }
    }, {
      key: 'path',
      value: function path() {
        return this._path;
      }
    }, {
      key: 'json',
      value: function json() {
        return this._data;
      }
    }, {
      key: 'data',
      value: function data() {
        return _.omit(this._data, this.linkAttr);
      }
    }, {
      key: 'get',
      value: function get(name) {
        return (this._data || {})[name];
      }
    }, {
      key: 'links',
      value: function links() {
        return this._data[this.options.linkAttr];
      }
    }, {
      key: 'link',
      value: function link(name) {
        var _links = this.links();

        if (!_links) {
          return null;
        }

        var _link = _links[name];

        if (!_link) {
          return null;
        }

        if (_link.href) {
          return Resource.fetch(_link.href, this.options);
        }

        return null;
      }
    }]);
    return Resource;
  })();

  var HalApi = (function () {
    function HalApi(options) {
      babelHelpers.classCallCheck(this, HalApi);

      this.options = _.extend({
        linkAttr: 'links'
      }, options || {});

      if (!_.has(this.options, 'endpoint')) {
        throw new Error('missing endpoint property');
      }
    }

    babelHelpers.createClass(HalApi, [{
      key: 'request',
      value: function request(fn) {
        if (fn) {
          Resource.request = fn;
        }
      }
    }, {
      key: 'resource',
      value: function resource(path) {
        return Resource.fetch(path, this.options);
      }
    }]);
    return HalApi;
  })();

  return HalApi;

}));