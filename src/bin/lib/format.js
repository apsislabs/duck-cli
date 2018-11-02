import { createConverter } from "convert-svg-to-png";
import path from "path";
import rimraf from "rimraf";
import intoStream from "into-stream";
import through2 from "through2";
import { formatPdf } from "./formatters/formatPdf";
import { formatPng } from "./formatters/formatPng";
import { formatSvg } from "./formatters/formatSvg";
import { pngname } from "./utils/filenames";
import fsp from "./utils/fsp";
import Jimp from "jimp";

import { progressBar } from "./utils/progressBar";

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
  const svgBar = progressBar("SVG", renderings.length);
  const pngBar = progressBar("PNG", renderings.length);
  const cropBar = progressBar("Crop", renderings.length);

  const renderingStream = intoStream.obj(renderings);

  // Stream renderings
  // Stream SVG buffers to writing file to disk
  // Stream SVG buffers to conversion to PNG buffer
  // Stream PNG buffers to cropping PNG buffers if crop
  // After Stream end write to PDF if PDF
  let svgIndex = 0;
  let pngIndex = 0;
  let pngBuffers = [];

  return await new Promise((res, rej) => {
    renderingStream
      .pipe(
        through2.obj(async (chunk, enc, cb) => {
          formatSvg(chunk, svgIndex, output).then(() => svgBar.tick());
          svgIndex++;

          cb(null, chunk);
        })
      )
      .pipe(
        through2.obj(async (chunk, enc, cb) => {
          let pngBuffer = await formatPng(converter, chunk);
          fsp
            .writeFile(pngname(pngIndex, output), pngBuffer)
            .then(pngBar.tick());

          pngIndex++;
          cb(null, pngBuffer);
        })
      )
      .pipe(
        through2.obj(async (chunk, enc, cb) => {
          if (config.pdf.bleed) {
            let croppedBuffer = await Jimp.read(chunk).then(i => {
              cropBar.tick();
              return i.crop(5, 5, 200, 200).getBufferAsync(Jimp.MIME_PNG);
            });

            pngBuffers.push(croppedBuffer);
            cb(null, croppedBuffer);
          } else {
            pngBuffers.push(chunk);
            cb(null, chunk);
          }
        })
      )
      .pipe(
        through2.obj((chunk, enc, cb) => {
          cb(null);
        })
      )
      .on("finish", async () => {
        converter.destroy();
        await formatPdf(pngBuffers, output, config);
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
