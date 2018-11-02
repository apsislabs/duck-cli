import { createConverter } from "convert-svg-to-png";
import miss from "mississippi";
import path from "path";
import rimraf from "rimraf";
import { nullStream } from "./streams/nullStream";
import { cropStream } from "./streams/cropStream";
import { pdfStream } from "./streams/pdfStream";
import { pngStream } from "./streams/pngStream";
import { svgStream } from "./streams/svgStream";
import fsp from "./utils/fsp";

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

  const svg = config.format.includes("svg");
  const png = config.format.includes("png");
  const pdf = config.format.includes("pdf");

  const converter = pdf || png ? createConverter() : null;
  const size = renderings.length;

  let renderingStream = miss.from.obj(renderings);

  return await new Promise((res, rej) => {
    process.on("SIGINT", rej);

    const finalize = async err => {
      if (converter) converter.destroy();
      if (err) rej(err);
      res();
    };

    if (svg) {
      renderingStream = renderingStream.pipe(
        svgStream({
          output,
          size
        })
      );
    }

    if ((png || pdf) && converter) {
      renderingStream = renderingStream.pipe(
        pngStream({
          output,
          converter,
          size
        })
      );
    }

    if (pdf) {
      renderingStream = renderingStream
        .pipe(cropStream({ config, size }))
        .pipe(pdfStream({ output, config }));
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

  if (await fsp.exists(folder)) {
    rimraf.sync(folder);
  }
  if (!(await fsp.exists(folder))) {
    await fsp.mkdir(folder);
  }

  return folder;
};
