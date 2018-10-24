import fs from 'fs';
import path from 'path';
import { transformFileSync } from '@babel/core';

export const requireComponent = (requirePath) => {
  const baseName = path.basename(requirePath);
  const projectRoot = path.dirname(requirePath);

  // Transform file with babel
  const componentSource = transformFileSync(requirePath, {
    presets: ["@babel/preset-env", "@babel/preset-react"]
  }).code;

  const tmpFolder = path.join(projectRoot, 'tmp');

  // Generate the temp directory, write the transformed source
  if (!fs.existsSync(tmpFolder)) { fs.mkdirSync(tmpFolder); }
  const tmpFile = path.join(tmpFolder, baseName);
  fs.writeFileSync(tmpFile, componentSource);

  // Require component
  const Component = require(tmpFile).default;

  // Cleanup
  fs.unlinkSync(tmpFile);
  fs.rmdirSync(tmpFolder); // Perf: do this once per CLI operation, not once per card

  return Component;
}