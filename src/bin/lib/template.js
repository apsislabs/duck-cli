import path from 'path';
import React from 'react';

import { requireComponent } from './utils/require';
import { renderToStaticMarkup } from 'react-dom/server';

export const renderTemplates = async (projectRoot, config, data) => {
  const renderings = {};

  for (const deckKey in config) {
    renderings[deckKey] = await renderTemplate(projectRoot, config[deckKey], data[deckKey], deckKey);
  }

  return renderings;
}

const renderTemplate = async (projectRoot, config, data, deckKey) => {
  const templatePath = path.resolve(
    path.join(projectRoot, "templates", config.templateFront)
  );

  const Card = await requireComponent(templatePath);

  const renderings = [];

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    
    const dom = (
      <svg xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect
            x="0"
            y="0"
            width={config.width}
            height={config.height}
            strokeWidth="0"
            fill="none"
          />
        </g>
        <Card {...row} />
      </svg>
    );

    const svg = renderToStaticMarkup(dom);

    renderings.push({ svg });
  }

  return renderings;
}
