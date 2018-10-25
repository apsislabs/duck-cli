import fsp from './fsp';
import path from 'path';
import { transformFileAsync } from '@babel/core';

export const requireComponent = async (requirePath) => {
  const baseName = path.basename(requirePath);
  const projectRoot = path.dirname(requirePath);

  // Transform file with babel
  const componentSource = await transformFileAsync(requirePath, {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [ ["@babel/plugin-transform-runtime", { "corejs": 2 }] ]
  });

  const tmpFolder = path.join(projectRoot, 'tmp');

  // Generate the temp directory, write the transformed source
  if (! await fsp.exists(tmpFolder)) { await fsp.mkdir(tmpFolder); }
  const tmpFile = path.join(tmpFolder, baseName);
  await fsp.writeFile(tmpFile, componentSource.code);

  // Require component
  const Component = require(tmpFile).default;

  // Cleanup
  await fsp.unlink(tmpFile);
  await fsp.rmdir(tmpFolder); // Perf: do this once per CLI operation, not once per card

  return Component;
}