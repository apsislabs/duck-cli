import fs from "fs";
import Jimp from "jimp";
import _ from "lodash";
import path from "path";
import PDFDocument from "pdfkit";
import ProgressBar from "progress";
import { insToPts, pxToPts } from "../utils/units";

export const formatPdf = async (pngPaths, out, config) => {
  let {
    layout = "landscape",
    size = "letter",
    margin = 0.5,
    bleed
  } = config.pdf;
  const docConfig = { layout, size };
  const doc = new PDFDocument(docConfig);

  // Get and crop images, if needed
  let pngBuffers = _.map(pngPaths, p => fs.readFileSync(p));
  let cardWidthPx = config.width;
  let cardHeightPx = config.height;

  if (bleed) {
    cardWidthPx = cardWidthPx - bleed * 2;
    cardHeightPx = cardHeightPx - bleed * 2;
    pngBuffers = await cropImages(pngBuffers, bleed, cardWidthPx, cardHeightPx);
  }

  // Calculate all layout values
  const marginPts = insToPts(margin);
  const docWidth = doc.page.width;
  const docHeight = doc.page.height;
  const cardWidthPts = pxToPts(cardWidthPx);
  const cardHeightPts = pxToPts(cardHeightPx);
  const pageWidth = docWidth - marginPts * 2; // width less margin
  const pageHeight = docHeight - marginPts * 2; // width less margin
  const cardsPerRow = Math.floor(pageWidth / cardWidthPts);
  const rowsPerPage = Math.floor(pageHeight / cardHeightPts);
  const rows = _.chunk(pngBuffers, cardsPerRow);
  const pages = _.chunk(rows, rowsPerPage);
  const trimLines = config.pdf.trim_lines;

  // Do layout
  return new Promise((res, err) => {
    const outPath = path.join(out, "out.pdf");
    const pdfStream = fs.createWriteStream(outPath);
    const pdfProgress = new ProgressBar("Format PDF :bar (:current/:total)", {
      total: pngBuffers.length
    });

    try {
      doc.pipe(pdfStream);

      // Iterate Pages
      _.forEach(pages, (rows, i) => {
        if (i > 0) doc.addPage();

        // Iterate Rows
        _.forEach(rows, (row, j) => {
          let y = j * cardHeightPts + marginPts;

          if (trimLines) {
            drawTrimLine(doc, 0, y, docWidth, y);
          }

          // Iterate Cards
          _.forEach(row, (card, k) => {
            let x = k * cardWidthPts + marginPts;

            if (trimLines) {
              drawTrimLine(doc, x, 0, x, docHeight);
            }

            doc.image(card, x, y, {
              width: cardWidthPts,
              height: cardHeightPts
            });

            pdfProgress.tick();

            // Last Card in Row
            if (k + 1 === row.length) {
              let finalX = x + cardWidthPts;
              if (trimLines) {
                drawTrimLine(doc, finalX, 0, finalX, docHeight);
              }
            }
          });

          // Last Row on Page
          if (j + 1 === rows.length) {
            let finalY = y + cardHeightPts;
            if (trimLines) {
              drawTrimLine(doc, 0, finalY, docWidth, finalY);
            }
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

const cropImages = async (buffers, m, w, h) => {
  const cropBar = new ProgressBar("Crop Images :bar (:current/:total)", {
    total: buffers.length
  });

  const promises = _.map(buffers, buff => {
    return Jimp.read(buff).then(i => {
      cropBar.tick();
      return i.crop(m, m, w, h).getBufferAsync(Jimp.MIME_PNG);
    });
  });

  return await Promise.all(promises);
};

const drawTrimLine = (doc, startX, startY, endX, endY) => {
  doc
    .moveTo(startX, startY)
    .lineWidth(0.5)
    .lineTo(endX, endY)
    .dash(5)
    .stroke("#ccc");
};
