const utils = {
  url: (endpoint, path) => {
    const len = endpoint.length;

    return [
      endpoint.charAt(len - 1) === '/'  ? endpoint.substr(0, len - 1) : endpoint,
      path.charAt(0) === '/' ? path.substring(1) : path
    ].join('/');
  }
};

export default utils;
