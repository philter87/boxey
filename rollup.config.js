// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import copy from 'rollup-plugin-copy'

export const OUTPUT_FOLDER = 'dist';
export default {
  input: 'src/index.ts',
  watch: {
      include: ['src/**'],
      exclude: './node_modules/**'
  },
  output: {
    dir: OUTPUT_FOLDER,
    format: 'cjs',
  },
  plugins: [
      typescript(),
      copy({targets: [{src:'static/index.html', dest: 'dist'}]}),
      serve(OUTPUT_FOLDER),
      livereload(OUTPUT_FOLDER)
  ],
};