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

  constructor (path, options) {
    this._path = path;
    this.options = options;
    this.linkAttr = options.linkAttr || 'links';
  }

  save (body) {
    this._data = body;
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

  links () {
    return this._data[this.options.linkAttr];
  }

  link (name) {
    const _links = this.links();

    if (!_links) {
      return null;
    }

    const _link = _links[name];

    if (!_link) {
      return null;
    }

    if (_link.href) {
      return new Resource(_link.href, this.options);
    }

    return null;
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
