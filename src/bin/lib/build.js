import { readConfig } from './config';
import { readData } from './data';
import { renderTemplates } from './template';

export const build = async (projectRoot) => {
  console.log(`...Building deck for ${projectRoot}`);

  const config = readConfig(projectRoot);
  const csv = readData(projectRoot, config);
  const templates = await renderTemplates(projectRoot, config, csv);
}