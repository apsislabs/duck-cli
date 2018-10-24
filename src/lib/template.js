import path from 'path';
import fs from 'fs';
import React from 'react';

import { requireComponent } from './utils/require';

import { renderToStaticMarkup } from 'react-dom/server';


export const renderTemplates = (projectRoot, config, data) => {
  for (const deckKey in config) {
    renderTemplate(projectRoot, config[deckKey], data[deckKey], deckKey);    
  }
}

const renderTemplate = (projectRoot, config, data, deckKey) => {
  const templatePath = path.resolve(path.join(projectRoot, 'templates', config.templateFront));

  const Card = requireComponent(templatePath);

  const output = deckFolder(projectRoot, deckKey);
  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    const cardPath = path.join(output, filename(rowIdx, row, data));
    
    const dom = (<svg><Card {...row} /></svg>);

    const svg = renderToStaticMarkup(dom);

    fs.writeFileSync(cardPath, svg); // Perf: This needs to be async
  }
}

const filename = (rowIdx, row, data) => `card_${rowIdx}.svg`;

const deckFolder = (projectRoot, deckKey) => {
  const output = path.join(projectRoot, 'output');
  const folder = path.join(output, deckKey);

  if (!fs.existsSync(output)) { fs.mkdirSync(output); }
  if (!fs.existsSync(folder)) { fs.mkdirSync(folder); }

  return folder;
}