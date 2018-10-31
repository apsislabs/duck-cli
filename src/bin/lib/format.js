import { createConverter } from "convert-svg-to-png";
import PDFDocument from "pdfkit";
import path from "path";
import rimraf from "rimraf";
import fsp from "./utils/fsp";
import fs from "fs";
import _ from "lodash";

export const formatCards = async (projectRoot, config, data, renderings) => {
  for (const deckKey in config) {
    await formatDeck(
      projectRoot,
      config[deckKey],
      data[deckKey],
      renderings[deckKey],
      deckKey
    );
  }
};

const formatDeck = async (projectRoot, config, data, renderings, deckKey) => {
  const output = await deckFolder(projectRoot, deckKey);

  const svg = config.format.includes("svg");
  const png = config.format.includes("png");
  const pdf = config.format.includes("pdf");

  const promises = [];
  const generatedPngs = [];
  const converter = createConverter();

  try {
    console.log("...saving files");
    for (let i = 0; i < renderings.length; i++) {
      process.stdout.write(".");

      if (svg) {
        promises.push(formatSvg(renderings[i], i, output));
      }

      if (png || pdf) {
        generatedPngs.push(pngname(i, output));
        await formatPng(converter, renderings[i], i, output);
      }
    }

    if (pdf) {
      await formatPdf(generatedPngs, output, config);
    }
  } finally {
    converter.destroy();
    process.stdout.write("\n");
  }

  await Promise.all(promises);
};

const formatSvg = async (rendering, idx, output) => {
  await fsp.writeFile(svgname(idx, output), rendering.svg);
};

const formatPng = async (converter, rendering, idx, output) => {
  const png = await converter.convert(rendering.svg, {
    width: rendering.width,
    height: rendering.height
  });

  fs.writeFileSync(pngname(idx, output), png);
};

const formatPdf = async (pngPaths, out, config) => {
  // console.log(pngPaths);
  const doc = new PDFDocument({
    layout: "landscape"
  });

  const outPath = path.join(out, "out.pdf");
  const pdfStream = fs.createWriteStream(outPath);

  let docWidth = insToPts(11);
  let docHeight = insToPts(8.5);
  let margin = insToPts(0.5);
  let pageWidth = docWidth - margin * 2; // width less margin
  let pageHeight = docHeight - margin * 2; // width less margin
  let cardWidth = pxToPts(config.width); // card width in pts
  let cardHeight = pxToPts(config.height); // card width in pts
  let cardsPerRow = Math.floor(pageWidth / cardWidth);
  let rowsPerPage = Math.floor(pageHeight / cardHeight);

  let rows = _.chunk(pngPaths, cardsPerRow);
  let pages = _.chunk(rows, rowsPerPage);

  return new Promise((res, err) => {
    try {
      doc.pipe(pdfStream);

      // Iterate Pages
      _.forEach(pages, (rows, i) => {
        if (i > 0) doc.addPage();

        // Iterate Rows
        _.forEach(rows, (row, j) => {
          let y = j * cardHeight + margin;

          doc
            .moveTo(0, y)
            .lineTo(docWidth, y)
            .dash(5, { space: 10 })
            .stroke();

          // Iterate Cards
          _.forEach(row, (card, k) => {
            let x = k * cardWidth + margin;

            doc
              .moveTo(x, 0)
              .lineTo(x, docHeight)
              .dash(5, { space: 10 })
              .stroke();

            doc.image(card, x, y, { width: cardWidth, height: cardHeight });
          });
        });

        console.log("after card each");
      });
      console.log("after pages each");
      doc.end();
    } catch (e) {
      console.error(e.stack);
      err(e);
    }

    pdfStream.addListener("finish", res);
  });
};

const insToPts = (s = 0) => s * 72;
const ptsToIns = (s = 0) => s / 72;
const insToPx = (s = 0) => s * 300;
const pxToIns = (s = 0) => s / 300;
const pxToPts = (s = 0) => (s / 300) * 72;
const ptsToPx = (s = 0) => (s / 72) * 300;

const svgname = (rowIdx, output) =>
  path.join(output, `${filename(rowIdx)}.svg`);
const pngname = (rowIdx, output) =>
  path.join(output, `${filename(rowIdx)}.png`);
const filename = rowIdx => `card_${pad(rowIdx, 2)}`;

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}

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
