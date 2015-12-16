import Halapi from '../source';
import { createServer } from './_server';
import got from 'got';
import fs from 'mz/fs';
import path from 'path';

export function fixtures (name) {
  const filename = path.resolve(__dirname, path.join('../../test/fixtures/', name));

  return fs.readFile(filename).then((content) => {
    return JSON.parse(content);
  });
}

export function server (routes = []) {
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

    api.request((url) => {
      return got(url);
    });

    return api;
  });
}
