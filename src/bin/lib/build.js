import { readConfig } from "./config.js";
import { readData } from "./data.js";
import { renderTemplates } from "./template.js";
import { formatCards } from "./format.js";
import { verboseLog } from "./utils/logger.js";

export const build = async (projectRoot, confOverride) => {
  verboseLog(`...Building deck for ${projectRoot}`);

  const config = await readConfig(projectRoot, confOverride);

  const data = await readData(projectRoot, config);
  const renderings = await renderTemplates(projectRoot, config, data);
  await formatCards(projectRoot, config, data, renderings);
};
