import { readConfig } from './config';
import { readData } from './data';
import { renderTemplates } from './template';

export const build = (projectRoot) => {
  console.log(`...Building deck for ${projectRoot}`);

  const config = readConfig(projectRoot);
  const csv = readData(projectRoot, config);
  const templates = renderTemplates(projectRoot, config, csv);

  console.log("read config and produced", config);
  console.log("read csv and produced", csv);
}