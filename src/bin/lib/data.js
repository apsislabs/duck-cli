import _ from "lodash";
import Papa from "papaparse";
import path from "path";
import request from "request-promise-native";
import { DATA_FOLDER } from "./constants";
import fsp from "./utils/fsp";

function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(s);
}

export const readData = async (projectRoot, config) => {
  const data = {};

  for (const deckKey in config) {
    data[deckKey] = await parseCsv(projectRoot, config[deckKey], deckKey);
  }

  return data;
};

const parseCsv = async (projectRoot, deckConfig, deckKey) => {
  const dataFile = deckConfig.data;
  let csv = null;

  try {
    if (isUrl(dataFile)) {
      csv = await request(dataFile);
    } else {
      const csvPath = path.join(projectRoot, DATA_FOLDER, dataFile);
      csv = await fsp.readFile(csvPath, "utf8");
    }
  } catch (e) {
    console.error(e);
    return null;
  }

  const csvResult = Papa.parse(csv, { skipEmptyLines: true, header: true });
  const data = csvResult.data;
  return explode(deckConfig, data);
};

const explode = (config, data) => {
  if (!config.explode || !_.has(data, config.explode)) {
    return data;
  }

  return _.flatMap(data, row => {
    const explosionCount = row[config.explode] || 1;

    return Array.from({ length: explosionCount }).map(() => _.clone(row));
  });
};
