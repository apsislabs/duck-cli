import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';


export const readConfig = (projectRoot) => {
  const configFile = `${projectRoot}${path.sep}deck.config.yml`;
  console.log(`...Looking for config in file ${configFile}`);

  try {
    const rawConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    processConfig(rawConfig);
    console.log(rawConfig);
  } catch (e) {
    console.error("...an error while reading the config: ", e);
    throw e;
  }
}

const processConfig = (config) => {
  for (const key in config) {
    processDeckConfig(config[key], key);
  }
}

const processDeckConfig = (deckConfig, deckKey) => {
  if (!deckConfig.width) { throw `Parameter 'width' is required in deck ${deckKey}` }
  if (!deckConfig.height) { throw `Parameter 'height' is required in deck ${deckKey}` }

  deckConfig.format = deckConfig.format || "svg";
  deckConfig.data = deckConfig.data = `${deckKey}.csv`;
  deckConfig.front_template = deckConfig.front_template || `${deckKey}.js`;
}