import { readConfig } from "./config";
import { readData } from "./data";
import { renderTemplates } from "./template";
import { formatCards } from "./format";

export const build = async projectRoot => {
  console.log(`...Building deck for ${projectRoot}`);

  const config = await readConfig(projectRoot);
  const data = await readData(projectRoot, config);
  const renderings = await renderTemplates(projectRoot, config, data);
  await formatCards(projectRoot, config, data, renderings);
};
