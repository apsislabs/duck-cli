import fs from "fs";
import _ from "lodash";
import path from "path";
import PDFDocument from "pdfkit";
import { insToPts, pxToPts } from "../utils/units";
export const formatPdf = async (pngPaths, out, config) => {
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
