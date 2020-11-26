import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: path.resolve(__dirname, 'src', 'index.ts'),
  output: [
    {
      format: 'esm',
      file: path.resolve(__dirname, 'lib', 'esm5.js'),
      sourcemap: true,
    },
    {
      format: 'cjs',
      file: path.resolve(__dirname, 'lib', 'cjs5.js'),
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions, preferBuiltins: true }),
    commonjs(),
    babel({ extensions, babelHelpers: 'bundled' }),
  ],
};
