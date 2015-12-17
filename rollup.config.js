import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'source/index.js',
  dest: 'bundle.js',
  format: 'umd',
  external: ['lodash'],
  plugins: [
    babel({
      presets: [require("babel-preset-es2015-rollup")]
    }),
    commonjs({
      exclude: 'node_modules/**'
    })
  ]
};
