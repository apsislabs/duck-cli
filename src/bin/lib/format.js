import { createConverter } from "convert-svg-to-png";
import fs from "fs";
import _ from "lodash";
import path from "path";
import PDFDocument from "pdfkit";
import { crop } from "png-crop";
import rimraf from "rimraf";
import { pngname, svgname } from "./utils/filenames";
import fsp from "./utils/fsp";
import { insToPts, pxToPts } from "./utils/units";
import { promisify } from "util";

// Wrap crop
const cropSync = promisify(crop);

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
      let pngPaths = generatedPngs;

      if (config.crop) {
        console.log("\n ...cropping images");
        pngPaths = await cropPngs(generatedPngs, output, config);
      }

      console.log("\n ...generating PDF");
      console.log(pngPaths);
      await formatPdf(pngPaths, output, config);
    }
  } finally {
    converter.destroy();
    process.stdout.write("\n");
  }

  await Promise.all(promises);
};

const cropPngs = async (pngPaths, output, config) => {
  const width = config.width - config.crop * 2;
  const height = config.height - config.crop * 2;
  const cropOpts = { width, height, left: config.crop, top: config.crop };

  let cropPromises = _.map(pngPaths, async p => {
    let basename = path.basename(p);
    let dest = path.join(output, `cropped_${basename}`);

    try {
      await cropSync(p, dest, cropOpts);
    } catch (e) {
      console.error(e.stack);
    }

    return dest;
  });

  return await Promise.all(cropPromises);
};

const formatSvg = async (rendering, idx, output) => {
  await fsp.writeFile(svgname(idx, output), rendering.svg);
};

const formatPng = async (converter, rendering, idx, output) => {
  const png = await converter.convert(rendering.svg, {
    width: rendering.width,
    height: rendering.height
  });

  await fsp.writeFile(pngname(idx, output), png);
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
