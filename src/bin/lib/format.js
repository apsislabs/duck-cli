import { createConverter } from "convert-svg-to-png";
import miss from "mississippi";
import path from "path";
import rimraf from "rimraf";
import { cropStream } from "./streams/cropStream";
import { pdfStream } from "./streams/pdfStream";
import { pngStream } from "./streams/pngStream";
import { svgStream } from "./streams/svgStream";
import fsp from "./utils/fsp";
import { capStream } from "./streams/capStream";

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

  const converter = createConverter();
  const size = renderings.length;
  let renderingStream = miss.from.obj(renderings);

  return await new Promise((res, rej) => {
    if (svg) {
      renderingStream = renderingStream.pipe(
        svgStream({
          output,
          size
        })
      );
    }

    if (png || pdf) {
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
      .pipe(capStream())
      .on("error", rej)
      .on("finish", async err => {
        if (err) rej(err);
        converter.destroy();
        res();
      });
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
