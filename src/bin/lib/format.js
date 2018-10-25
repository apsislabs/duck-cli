import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import sharp from 'sharp';

const { promisify } = require("util");

const writeFile = promisify(fs.writeFile);

export const formatCards = async (projectRoot, config, data, renderings) => {
  for (const deckKey in config) {
    await formatDeck(projectRoot, config[deckKey], data[deckKey], renderings[deckKey], deckKey);
  }
}

const formatDeck = async (projectRoot, config, data, renderings, deckKey) => {
  const output = deckFolder(projectRoot, deckKey);

  const svg = config.format.includes("svg");
  const png = config.format.includes("png");

  const promises = [];

  for (let i = 0; i < renderings.length; i++) {
    
    if (svg) {
      promises.push(formatSvg(renderings[i], i, output));
    }
  
    if (png) {
      promises.push(formatPng(renderings[i], i, output));
    }
  }

  await Promise.all(promises);
}

const formatSvg = async (rendering, idx, output) => {
  await writeFile(svgname(idx, output), rendering.svg);
}

const formatPng = async (rendering, idx, output) => {
  await sharp(Buffer.from(rendering.svg))
      .png()
      .toFile(pngname(idx, output));
}

const svgname = (rowIdx, output) => path.join(output, `${filename(rowIdx)}.svg`);
const pngname = (rowIdx, output) => path.join(output, `${filename(rowIdx)}.png`);
const filename = (rowIdx) => `card_${rowIdx}`;

const deckFolder = (projectRoot, deckKey) => {
  const output = path.join(projectRoot, 'output');
  const folder = path.join(output, deckKey);

  if (!fs.existsSync(output)) { fs.mkdirSync(output); }

  if (fs.existsSync(folder)) { rimraf.sync(folder); }
  if (!fs.existsSync(folder)) { fs.mkdirSync(folder); }

  return folder;
}