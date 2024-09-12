// rollup.config.js
import { readFileSync } from "node:fs";
import typescript from "@rollup/plugin-typescript";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)).toString()
);

export default {
  input: "./main.ts",
  output: {
    dir: "./dist",
    entryFileNames: `main.js`,
    chunkFileNames: "chunks/dep-[hash].js",
    exports: "named",
    format: "esm",
  },
  external: ["fs", "path", ...Object.keys(pkg.dependencies)],
  plugins: [typescript()],
};
