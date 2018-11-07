import { readConfig } from "./config";
import { readData } from "./data";
import { renderTemplates } from "./template";
import { formatCards } from "./format";
import { verboseLog } from "./utils/logger";

export const build = async (projectRoot, confOverride) => {
  verboseLog(`...Building deck for ${projectRoot}`);

  const config = await readConfig(projectRoot, confOverride);

  const data = await readData(projectRoot, config);
  const renderings = await renderTemplates(projectRoot, config, data);
  await formatCards(projectRoot, config, data, renderings);
};
