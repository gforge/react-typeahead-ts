import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const shared = {
  input: `compiled/index.js`,
  external: ['react', 'tslib'],
};

const commonJsResolver = commonjs({
  // non-CommonJS modules will be ignored, but you can also
  // specifically include/exclude files
  include: 'node_modules/**', // Default: undefined
  // these values can also be regular expressions
  // include: /node_modules/

  // search for files other than .js files (must already
  // be transpiled by a previous plugin!)
  extensions: ['.js', '.coffee', '.json'], // Default: [ '.js' ]

  // if true then uses of `global` won't be dealt with by this plugin
  ignoreGlobal: true, // Default: false

  // if false then skip sourceMap generation for CommonJS modules
  sourceMap: true, // Default: true
});

const sharedPlugins = [commonJsResolver];

export default [
  {
    ...shared,
    output: {
      name: 'react-typeahead-ts',
      format: 'umd',
      sourcemap: true,
      file:
        process.env.NODE_ENV === 'production'
          ? './dist/typeahead.umd.min.js'
          : './dist/typeahead.umd.js',
      exports: 'named',
      globals: {
        react: 'React',
        tslib: 'tslib',
        classnames: 'classNames',
        fuzzy: 'fuzzy',
      },
    },
    external: shared.external.concat(Object.keys(pkg.dependencies)),
    plugins: [
      ...sharedPlugins,
      replace({
        exclude: 'node_modules/**',
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
      sourceMaps(),
      process.env.NODE_ENV === 'production' && filesize(),
      process.env.NODE_ENV === 'production' &&
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
          },
          warnings: true,
          ecma: 5,
          toplevel: false,
        }),
    ],
  },

  {
    ...shared,
    external: shared.external.concat(Object.keys(pkg.dependencies)),
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      ...sharedPlugins,
      sourceMaps(),
      process.env.NODE_ENV === 'production' && filesize(),
    ],
  },
];
