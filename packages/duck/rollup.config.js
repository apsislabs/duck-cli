// rollup.config.js
import { readFileSync } from 'node:fs'
import typescript from '@rollup/plugin-typescript';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString(),
)

export default {
  input: 'src/main.ts',
  output: {
    dir: './dist',
    entryFileNames: `main.js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
  },
  external: ['fs', 'path', 'fs/promises', 'react-dom/server', 'csv-parse/sync', 'datauri/sync.js', ...Object.keys(pkg.dependencies)],
  plugins: [typescript()]
};
