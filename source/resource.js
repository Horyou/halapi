import utils from './utils';
import _ from 'lodash';

export default class Resource {
  static request (url) {
    throw new Error('Not implemented');
  }

  static fetch (path, options) {
    const resource = new Resource(path, options);

    return resource.fetch();
  }

  constructor (path, options = {}) {
    this._path = path;
    this.options = options;
    this.linkAttr = options.linkAttr || 'links';
  }

  save (body) {
    this._data = body;

    return this;
  }

  path () {
    return this._path;
  }

  json () {
    return this._data;
  }

  data () {
    return _.omit(this._data, this.linkAttr);
  }

  get (name) {
    return (this._data || {})[name];
  }

  links (name) {
    const _links = this._data[this.linkAttr] || {};

    if (!name) {
      return _links;
    }

    return _links[name] ? _links[name] : _links;
  }

  link (name) {
    if (!this.hasLink(name)) {
      return null;
    }

    return new Resource(this.links(name).href, this.options);
  }

  hasLink (name) {
    const link = this.links(name);

    if (!link) {
      return false;
    }

    return !!link.href;
  }

  resource (name) {
    const link = this.link(name);

    if (!link) {
      return Promise.reject(new Error('The resource <' + name + '> does not exists'));
    }

    return Promise.resolve(link.fetch());
  }

  url () {
    const { endpoint } = this.options;

    return  utils.url(endpoint, this.path());
  }

  fetch () {
    return Resource.request(this.url())
      .then((response) => {
        this.save(response.body);

        return this;
      });
  }
}
