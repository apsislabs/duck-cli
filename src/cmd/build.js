import path from 'path';

import { readConfig } from '../lib/config';
import { readData } from '../lib/data';

export const buildCommand = (projectRoot = '.') => {
  const resolvedProjectRoot = path.resolve(projectRoot);
  console.log(`...Building deck for ${resolvedProjectRoot}`);

  const config = readConfig(resolvedProjectRoot);
  const csv = readData(resolvedProjectRoot, config);

  console.log("read config and produced", config);
  console.log("read csv and produced", csv);
}