import path from "path";
import miss from "mississippi";
import puppeteer from "puppeteer";

import { cropStream } from "./streams/cropStream.js";
import { nullStream } from "./streams/nullStream.js";
import { pdfStream } from "./streams/pdfStream.js";
import { pngStream } from "./streams/pngStream.js";

import fsp from "./utils/fsp.js";

export const formatCards = async (projectRoot, config, data, renderings) => {
  for (const deckKey in config) {
    await formatDeck(
      projectRoot,
      config[deckKey],
      renderings[deckKey],
      deckKey
    );
  }
};

const formatDeck = async (projectRoot, config, renderings, deckKey) => {
  const output = await deckFolder(projectRoot, deckKey);

  const png = config.format.includes("png");
  const pdf = config.format.includes("pdf");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const size = renderings.length;

  let renderingStream = miss.from.obj(renderings);

  return await new Promise((res, rej) => {
    process.on("SIGINT", rej);

    const finalize = async err => {
      if (browser) await browser.close();
      if (err) rej(err);
      res();
    };

    if ((png || pdf) && page) {
      renderingStream = renderingStream.pipe(
        pngStream({
          output,
          page,
          size,
          deckKey,
          config
        })
      );
    }

    if (pdf) {
      renderingStream = renderingStream
        .pipe(cropStream({ config, size, deckKey }))
        .pipe(pdfStream({ output, config, deckKey }));
    }

    renderingStream
      .pipe(nullStream())
      .on("error", finalize)
      .on("end", finalize)
      .on("finish", finalize);
  });
};

const deckFolder = async (projectRoot, deckKey) => {
  const output = path.join(projectRoot, "output");
  const folder = path.join(output, deckKey);

  if (!(await fsp.exists(output))) {
    await fsp.mkdir(output);
  }

  if (!(await fsp.exists(folder))) {
    await fsp.mkdir(folder);
  }

  return folder;
};
