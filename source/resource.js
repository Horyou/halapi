import utils from './utils';

export default class Resource {
  static fetch (path, options, request) {
    const { endpoint } = options;
    const url = utils.url(endpoint, path);

    return request(url).then((response) => {
      const resource = new Resource(path, options);

      return resource;
    });
  }

  constructor (path, options) {
    this._path = path;
    this.options = options;
  }
}
