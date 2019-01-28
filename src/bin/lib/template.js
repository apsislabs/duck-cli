import _ from "lodash";
import { join, resolve } from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import rimraf from "rimraf";
import { DeckProvider } from "../../components/DeckContext";
import { TEMPLATE_FOLDER, TMP_FOLDER } from "./constants";
import fsp from "./utils/fsp";
import { transformDir } from "./utils/transform";
import { verboseLog } from "./utils/logger";

export const renderTemplates = async (projectRoot, config, data) => {
  const renderings = {};

  const templatesPath = join(projectRoot, TEMPLATE_FOLDER);
  const tmpPath = join(projectRoot, TMP_FOLDER);

  await transpileTemplates(templatesPath, tmpPath);

  for (const deckKey in config) {
    let deckConfig = config[deckKey];
    let deckData = data[deckKey];

    renderings[deckKey] = await renderTemplate(
      tmpPath,
      deckConfig.template,
      deckConfig,
      deckData
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
    babel = await fsp.readJson(join(projectRoot, ".babelrc"));
  } catch (e) {
    verboseLog(`... Error loading .babelrc: ${e}`);
  }

  await transformDir(projectRoot, tmpPath, { babel });
};

const loadTemplate = filePath => {
  return require(filePath).default;
};

const renderTemplate = async (templatesPath, templateName, config, data) => {
  const documentPath = join(templatesPath, "__document");
  const templatePath = join(templatesPath, templateName);
  const useCustomDocument = await fsp.exists(documentPath);

  const Card = loadTemplate(resolve(templatePath));
  const Document = useCustomDocument
    ? loadTemplate(resolve(documentPath))
    : loadTemplate("../../components/__document");

  const renderings = _.map(data, (row, i) => {
    const { width, height } = config;

    const dom = (
      <Document width={width} height={height}>
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
