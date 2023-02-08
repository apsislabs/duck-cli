import _ from "lodash";
import { join, resolve } from "path";
import React from "react";
import * as ReactDOMServer from 'react-dom/server';
import rimraf from "rimraf";
import { DeckProvider } from "../../components/DeckContext.js";
import { TEMPLATE_FOLDER, TMP_FOLDER } from "./constants.js";
import fsp from "./utils/fsp.js";
import { verboseLog } from "./utils/logger.js";
import { transformDir } from "./utils/transform.js";

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
  let config = {};

  try {
    config = await fsp.readJson(join(projectRoot, ".swcrc"));
  } catch (e) {
    verboseLog(`... Error loading .swcrc: ${e}`);
  }

  await transformDir(projectRoot, tmpPath, { config });
};

const loadTemplate = filePath => import(filePath);

const renderTemplate = async (templatesPath, templateName, config, data) => {
  const documentPath = join(templatesPath, "__document.js");
  const templatePath = join(templatesPath, templateName);
  const useCustomDocument = await fsp.exists(documentPath);

  const Card = (await loadTemplate(resolve(templatePath))).default;
  const Document = useCustomDocument
    ? (await loadTemplate(resolve(documentPath))).default
    : (await loadTemplate("../../components/__document.js")).default;

  const renderings = _.map(data, (row, i) => {
    const { width, height } = config;

    const dom = (
      <Document width={width} height={height}>
        <DeckProvider value={config}>
          <Card {...row} config={config} deck={data} cardIndex={i} />
        </DeckProvider>
      </Document>
    );

    const html = ReactDOMServer.renderToStaticMarkup(dom);

    return { html, width, height };
  });


  return renderings;
};
