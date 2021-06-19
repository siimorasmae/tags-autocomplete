import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import vue from 'rollup-plugin-vue';
import json from '@rollup/plugin-json'
import css from 'rollup-plugin-import-css';

export default {
  input: 'src/index.js',
  output: {
    format: 'es',
    file: './index.js',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    nodeResolve(),
    vue(),
    commonjs(),
    terser(),
    css(),
  ],
};
