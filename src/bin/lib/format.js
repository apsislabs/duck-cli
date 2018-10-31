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
  const docWidth = insToPts(11);
  const docHeight = insToPts(8.5);
  const margin = insToPts(0.5);

  const pageWidth = docWidth - margin * 2; // width less margin
  const pageHeight = docHeight - margin * 2; // width less margin
  const cardWidth = pxToPts(config.width); // card width in pts
  const cardHeight = pxToPts(config.height); // card width in pts
  const cardsPerRow = Math.floor(pageWidth / cardWidth);
  const rowsPerPage = Math.floor(pageHeight / cardHeight);

  const rows = _.chunk(pngPaths, cardsPerRow);
  const pages = _.chunk(rows, rowsPerPage);
  const docConfig = {
    layout: "landscape",
    size: [docHeight, docWidth]
  };
  return new Promise((res, err) => {
    const doc = new PDFDocument(docConfig);
    const outPath = path.join(out, "out.pdf");
    const pdfStream = fs.createWriteStream(outPath);

    try {
      doc.pipe(pdfStream);

      // Iterate Pages
      _.forEach(pages, (rows, i) => {
        if (i > 0) doc.addPage();

        // Iterate Rows
        _.forEach(rows, (row, j) => {
          let y = j * cardHeight + margin;

          drawTrimLine(doc, 0, y, docWidth, y);

          // Iterate Cards
          _.forEach(row, (card, k) => {
            let x = k * cardWidth + margin;
            drawTrimLine(doc, x, 0, x, docHeight);

            doc.image(card, x, y, {
              width: cardWidth,
              height: cardHeight
            });

            // Last Card in Row
            if (k + 1 === row.length) {
              let finalX = x + cardWidth;
              drawTrimLine(doc, finalX, 0, finalX, docHeight);
            }
          });

          // Last Row on Page
          if (j + 1 === rows.length) {
            let finalY = y + cardHeight;
            drawTrimLine(doc, 0, finalY, docWidth, finalY);
          }
        });
      });
      doc.end();
    } catch (e) {
      err(e);
    }

    pdfStream.addListener("finish", res);
  });
};

const drawTrimLine = (doc, startX, startY, endX, endY) => {
  doc
    .moveTo(startX, startY)
    .lineWidth(0.5)
    .lineTo(endX, endY)
    .dash(5)
    .stroke("#ccc");
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
