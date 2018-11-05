import _ from "lodash";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import rimraf from "rimraf";
import { DeckProvider } from "../../components/DeckContext";
import { TEMPLATE_FOLDER, TMP_FOLDER } from "./constants";
import fsp from "./utils/fsp";
import { transformDir } from "./utils/transform";

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
  const Document = loadTemplate("../../components/__document");

  const renderings = _.map(data, (row, i) => {
    const { width, height, backgroundColor } = config;

    const dom = (
      <Document width={width} height={height} backgroundColor={backgroundColor}>
        <DeckProvider value={config}>
          <Card {...row} config={config} deck={data} cardIndex={i} />
        </DeckProvider>
      </Document>
    );

    const html = renderToStaticMarkup(dom);
    return { html, width, height };
  });

  return renderings;
};
