import Halapi from '../source';
import { createServer } from './_server';
import got from 'got';

export default function server () {
  const request = function (url) {
    return got(url);
  };

  return createServer().then((s) => {
    s.on('/api', (req, res) => {
      res.end('ok');
    });

    s.listen(s.port);

    const api = new Halapi({
      endpoint: s.url
    });

    api.request = request.bind(api);

    return api;
  });
}
