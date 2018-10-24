import fs from 'fs';
import { transformFileSync } from '@babel/core';

export const requireComponent = (path) => {
  const tmpPath = `${path}.transpiled.js`;

  // Transform file with babel
  const componentSource = transformFileSync(path, {
    presets: ["@babel/preset-env", "@babel/preset-react"]
  }).code;
  fs.writeFileSync(tmpPath, componentSource);

  // Require component
  const Component = require(tmpPath).default;

  // Cleanup
  fs.unlinkSync(tmpPath);

  return Component;
}