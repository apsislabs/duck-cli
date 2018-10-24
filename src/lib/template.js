import path from 'path';
import fs from 'fs';
import React from 'react';
import { transformFileSync } from '@babel/core';
import { renderToStaticMarkup } from 'react-dom/server';


export const renderTemplates = (projectRoot, config, data) => {
  for (const deckKey in config) {
    data[deckKey] = renderTemplate(projectRoot, config[deckKey], data[deckKey], deckKey);    
  }
}

const renderTemplate = (projectRoot, config, data, deckKey) => {
  const templatePath = path.resolve(path.join(projectRoot, 'templates', config.templateFront));

  const cardSource = transformFileSync(templatePath, {
    presets: ["@babel/preset-env", "@babel/preset-react"]
  }).code;

  const cardPath = path.join(projectRoot, 'tmp', config.templateFront);

  fs.writeFileSync(cardPath, cardSource);
  const CardThing = require(cardPath).default;
  console.log("loaded", CardThing);
  fs.unlinkSync(cardPath);

  const fuckit = path.join(projectRoot, 'output');
  fs.mkdirSync(fuckit, { recursive: true });
  const cardFolder = path.join(projectRoot, 'output', deckKey);
  fs.mkdirSync(cardFolder, { recursive: true });

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const cardPath = path.join(cardFolder, `card_${rowIdx}.svg`);
    const row = data[rowIdx];
    const dom = (<svg><CardThing {...row} /></svg>);

    const svg = renderToStaticMarkup(dom);
    fs.writeFileSync(cardPath, svg);
    // console.log(`...generated SVG Markup for deck ${deckKey} and card ${rowIdx}: `, svg);
  }
}