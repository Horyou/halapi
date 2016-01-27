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
        var resource = new Resource(path, options);

        return resource.fetch();
      }
    }]);

    function Resource(path) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      babelHelpers.classCallCheck(this, Resource);

      this._path = path;
      this.options = options;
      this.linkAttr = options.linkAttr || 'links';
    }

    babelHelpers.createClass(Resource, [{
      key: 'save',
      value: function save(body) {
        this._data = body;

        return this;
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
      value: function links(name) {
        var _links = this._data[this.linkAttr] || {};

        if (!name) {
          return _links;
        }

        return _links[name] ? _links[name] : _links;
      }
    }, {
      key: 'link',
      value: function link(name) {
        if (!this.hasLink(name)) {
          return null;
        }

        return new Resource(this.links(name).href, this.options);
      }
    }, {
      key: 'hasLink',
      value: function hasLink(name) {
        var link = this.links(name);

        if (!link) {
          return false;
        }

        return !!link.href;
      }
    }, {
      key: 'resource',
      value: function resource(name) {
        var link = this.link(name);

        if (!link) {
          return Promise.reject(new Error('The resource <' + name + '> does not exists'));
        }

        return Promise.resolve(link.fetch());
      }
    }, {
      key: 'url',
      value: function url() {
        var endpoint = this.options.endpoint;

        return utils.url(endpoint, this.path());
      }
    }, {
      key: 'fetch',
      value: function fetch() {
        var _this = this;

        return Resource.request(this.url()).then(function (response) {
          _this.save(response.body);

          return _this;
        });
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
        if (!fn) {
          throw new Error('Should provide a function');
        }

        Resource.request = fn;
      }
    }, {
      key: 'resource',
      value: function resource(path) {
        return new Resource(path, this.options);
      }

      // syntactic sugar

    }, {
      key: 'fetch',
      value: function fetch(path) {
        return this.resource(path, this.options).fetch();
      }
    }, {
      key: 'linkAttr',
      value: function linkAttr() {
        return this.options.linkAttr;
      }
    }]);
    return HalApi;
  })();

  HalApi.Resource = Resource;

  return HalApi;

}));