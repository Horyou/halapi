import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/halapi.umd.js';
config.moduleName = 'halapi';

export default config;
