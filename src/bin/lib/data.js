import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export const readData = (projectRoot, config) => {
  const data = {};

  for (const deckKey in config) {
    data[deckKey] = parseCsv(projectRoot, config[deckKey], deckKey);    
  }

  return data;
}

const parseCsv = (projectRoot, deckConfig, deckKey) => {
  const dataFile = deckConfig.data;
  const csvFile = path.join(projectRoot, 'data', dataFile);

  console.log(`...looking for CSV file for deck ${deckKey} in ${csvFile}`);
  const csv = fs.readFileSync(csvFile, 'utf8');

  const csvResult = Papa.parse(csv, {header: true});

  // TODO: Error checking here

  const data = csvResult.data;

  return explode(deckConfig, data);
}

const explode = (config, data) => {
  if (!config.explode) { return data; }

  return _.flatMap(data, row => {
    const explosionCount = row[config.explode] || 1;

    return Array.from({ length: explosionCount }).map( () => _.clone(row));
  });
}