import fsp from './utils/fsp';
import path from 'path';
import yaml from 'js-yaml';

export const readConfig = async (projectRoot) => {
  const configFile = path.join(projectRoot, 'deck.config.yml');

  console.log(`...Looking for config in file ${configFile}`);

  try {
    const rawConfig = yaml.safeLoad(await fsp.readFile(configFile, 'utf8'));
    processConfig(rawConfig);

    return rawConfig;
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

  deckConfig.format = normalizeFormat(deckConfig.format || "svg");
  deckConfig.data = deckConfig.data = `${deckKey}.csv`;
  deckConfig.templateFront = deckConfig.templateFront || `${deckKey}.js`;
}

const normalizeFormat = (format) => {
  if (Array.isArray(format)) { return format; }
  return [format];
}