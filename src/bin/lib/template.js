import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import rimraf from "rimraf";
import { DeckProvider } from "../../components/DeckContext";
import fsp from "./utils/fsp";
import { transformDir } from "./utils/transform";
import { TMP_FOLDER, TEMPLATE_FOLDER } from "./constants";

export const renderTemplates = async (projectRoot, config, data) => {
  const renderings = {};

  const templatesPath = path.join(projectRoot, TEMPLATE_FOLDER);
  const tmpPath = path.join(projectRoot, TMP_FOLDER);

  await transpileTemplates(templatesPath, tmpPath);

  for (const deckKey in config) {
    renderings[deckKey] = await renderTemplate(
      tmpPath,
      config[deckKey],
      data[deckKey]
    );
  }

  rimraf.sync(tmpPath);
  return renderings;
};

const transpileTemplates = async (projectRoot, tmpPath) => {
  let babel = {
    presets: ["@babel/preset-env", "@babel/preset-react"]
  };

  try {
    babel = await fsp.readJson(path.join(projectRoot, ".babelrc"));
  } catch (e) {}

  await transformDir(projectRoot, tmpPath, { babel });
};

const loadTemplate = filePath => {
  return require(filePath).default;
};

const renderTemplate = async (templatesPath, config, data) => {
  const templatePath = path.resolve(
    path.join(templatesPath, config.templateFront)
  );

  const Card = loadTemplate(templatePath);

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

        <DeckProvider value={config}>
          <Card {...row} config={config} deck={data} cardIndex={rowIdx} />
        </DeckProvider>
      </svg>
    );

    const svg = renderToStaticMarkup(dom);

    renderings.push({ svg, width: config.width, height: config.height });
  }

  return renderings;
};
