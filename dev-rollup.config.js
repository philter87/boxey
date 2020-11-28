// rollup.config.js
// import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from 'rollup-plugin-copy'
import { terser } from "rollup-plugin-terser";

export const OUTPUT_FOLDER = 'dist';
export default {
  input: 'src/test-run.ts',
  watch: {
      include: ['src/**'],
      exclude: './node_modules/**'
  },
  output: {
    file: "dist/index.js",
    format: 'cjs',
  },
  plugins: [
      typescript({target: "es6", declaration: false}),
      copy({targets: [{src:'static/index.html', dest: 'dist'}]}),
      serve({contentBase: OUTPUT_FOLDER, historyApiFallback: true}),
      livereload(OUTPUT_FOLDER),
      terser()
  ],
};