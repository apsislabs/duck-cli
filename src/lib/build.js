import { readConfig } from './config';
import { readData } from './data';

export const build = (projectRoot) => {
  console.log(`...Building deck for ${projectRoot}`);

  const config = readConfig(projectRoot);
  const csv = readData(projectRoot, config);

  console.log("read config and produced", config);
  console.log("read csv and produced", csv);
}