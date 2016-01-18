import utils from './utils';
import _ from 'lodash';

export default class Resource {
  static request (url) {
    throw new Error('Not implemented');
  }

  static fetch (path, options) {
    const { endpoint } = options;
    const url = utils.url(endpoint, path);

    return Resource.request(url).then((response) => {
      const resource = new Resource(path, options);

      resource.save(response.body);
      return resource;
    });
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
      return Resource.fetch(_link.href, this.options);
    }

    return null;
  }
}
