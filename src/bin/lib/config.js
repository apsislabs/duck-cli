import fsp from "./utils/fsp";
import path from "path";
import yaml from "js-yaml";
import _ from "lodash";
import { verboseLog } from "./utils/logger";
import { CONF_FILE } from "./constants";

export const readConfig = async (projectRoot, confOverride) => {
  const configFile = path.join(projectRoot, CONF_FILE);

  verboseLog(`...Looking for config in file ${configFile}`);

  try {
    let conf = yaml.safeLoad(await fsp.readFile(configFile, "utf8"));

    // Filter to keys if passed by CLI
    if (confOverride.decks) {
      conf = filterConfigs(conf, confOverride.decks);
    }

    // Normalize conf
    conf = normalizeConfigs(conf);

    // Override formats
    if (confOverride.formats) {
      conf = overrideFormats(conf, confOverride.formats);
    }

    return conf;
  } catch (e) {
    console.error("...an error while reading the config: ", e);
    throw e;
  }
};

const normalizeConfigs = conf => {
  return _.reduce(
    conf,
    (result, value, key) => {
      result[key] = processDeckConfig(value, key);
      return result;
    },
    {}
  );
};

const filterConfigs = (conf, decks) => {
  return _.pickBy(conf, (_c, k) => _.includes(decks, k));
};

const overrideFormats = (conf, formats) => {
  let format = normalizeFormat(formats);

  return _.reduce(
    conf,
    (result, value, key) => {
      result[key] = { ...value, format };
      return result;
    },
    {}
  );
};

const processDeckConfig = (deckConfig, deckKey) => {
  if (!deckConfig.width) {
    throw `Parameter 'width' is required in deck ${deckKey}`;
  }
  if (!deckConfig.height) {
    throw `Parameter 'height' is required in deck ${deckKey}`;
  }

  const defaults = {
    data: `${deckKey}.csv`,
    template: `${deckKey}.js`,
    format: ["png"],
    filename: "${deck}_${cardIndex}"
  };

  // Fix potentially bad data
  let conf = Object.assign(defaults, deckConfig);
  conf.format = normalizeFormat(conf.format);
  return conf;
};

const normalizeFormat = format => {
  if (Array.isArray(format)) {
    return format;
  }

  return [format];
};
