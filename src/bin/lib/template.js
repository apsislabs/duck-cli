import path from "path";
import fs from "fs";
import React from "react";

import sharp from "sharp";

import { requireComponent } from "./utils/require";
import { renderToStaticMarkup } from "react-dom/server";

import rimraf from "rimraf";

export const renderTemplates = async (projectRoot, config, data) => {
  for (const deckKey in config) {
    await renderTemplate(projectRoot, config[deckKey], data[deckKey], deckKey);
  }
};

const renderTemplate = async (projectRoot, config, data, deckKey) => {
  const templatePath = path.resolve(
    path.join(projectRoot, "templates", config.templateFront)
  );

  const Card = requireComponent(templatePath);
  const output = deckFolder(projectRoot, deckKey);

  for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    const cardPath = path.join(output, filename(rowIdx, row, data));
    const pngPath = path.join(output, pngname(rowIdx, row, data));

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

    await sharp(Buffer.from(svg))
      .png()
      .toFile(pngPath);

    fs.writeFileSync(cardPath, svg); // Perf: This needs to be async
  }
};

const filename = (rowIdx, row, data) => `card_${rowIdx}.svg`;
const pngname = (rowIdx, row, data) => `card_${rowIdx}.png`;

const deckFolder = (projectRoot, deckKey) => {
  const output = path.join(projectRoot, "output");
  const folder = path.join(output, deckKey);

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  if (fs.existsSync(folder)) {
    rimraf.sync(folder);
  }
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  return folder;
};
