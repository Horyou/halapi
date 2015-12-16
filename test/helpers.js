import Halapi from '../source';
import { createServer } from './_server';
import got from 'got';

export default function server (routes = []) {
  const request = function (url) {
    return got(url);
  };

  return createServer().then((s) => {
    s.on('/api', (req, res) => {
      res.end('ok');
    });

    routes.forEach((route) => {
      const method = route.method ? route.method : (req, res) => {
        if (!route.response) {
          return res.end('ok');
        }

        if (typeof route.response === 'string') {
          return res.end(route.response);
        }

        if (typeof route.response === 'object') {
          return res.end(JSON.stringify(route.response));
        }

        res.end(route.response.toString());
      };

      s.on(route.path, method);
    });

    s.listen(s.port);

    const api = new Halapi({
      endpoint: s.url
    });

    api.request = request.bind(api);

    return api;
  });
}
