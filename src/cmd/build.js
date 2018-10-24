import path from 'path';

import { readConfig } from '../lib/config';

export const buildCommand = (projectRoot = '.') => {
  const resolvedProjectRoot = path.resolve(projectRoot);
  console.log(`...Building deck for ${resolvedProjectRoot}`);

  const config = readConfig(resolvedProjectRoot);
}