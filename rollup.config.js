// rollup.config.js
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export const OUTPUT_FOLDER = 'dist';
export default {
  input: 'src/index.ts',
  watch: {
      include: ['src/**'],
      exclude: './node_modules/**'
  },
  output: [
      {
          file: pkg.main,
          format: 'cjs',
      },
      {
          file: pkg.module,
          format: 'es',
      },
      {
          file: pkg.browser,
          format: 'iife',
          name: pkg.name
      },
  ],
  plugins: [
      typescript(),
      terser({keep_classnames: true, keep_fnames: true})
  ],
};