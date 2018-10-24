import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export const readData = (projectRoot, config) => {
  const data = {};

  for (const deckKey in config) {
    data[deckKey] = parseCsv(projectRoot, config[deckKey], deckKey);    
  }

  return data;
}

const parseCsv = (projectRoot, deckConfig, deckKey) => {
  const dataFile = deckConfig.data;
  const csvFile = `${projectRoot}${path.sep}data/${dataFile}`;

  console.log(`...looking for CSV file for deck ${deckKey} in ${csvFile}`);
  const csv = fs.readFileSync(csvFile, 'utf8');

  const csvResult = Papa.parse(csv, {header: true});

  // TODO: Error checking here

  return csvResult.data;
}