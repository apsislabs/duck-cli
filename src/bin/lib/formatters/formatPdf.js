import fs from "fs";
import _ from "lodash";
import path from "path";
import PDFDocument from "pdfkit";
import { insToPts, pxToPts, ptsToPx } from "../utils/units";

export const formatPdf = async (pngPaths, out, config) => {
  let { layout = "landscape", size = "letter", margin = 0.5 } = config.pdf;
  const docConfig = { layout, size };
  const doc = new PDFDocument(docConfig);
  margin = insToPts(margin);

  const docWidth = doc.page.width;
  const docHeight = doc.page.height;
  const pageWidth = docWidth - margin * 2; // width less margin
  const pageHeight = docHeight - margin * 2; // width less margin
  const cardWidth = pxToPts(config.width); // card width in pts
  const cardHeight = pxToPts(config.height); // card width in pts
  const cardsPerRow = Math.floor(pageWidth / cardWidth);
  const rowsPerPage = Math.floor(pageHeight / cardHeight);
  const pngs = _.map(pngPaths, p => fs.readFileSync(p));
  const rows = _.chunk(pngs, cardsPerRow);
  const pages = _.chunk(rows, rowsPerPage);
  const trimLines = config.pdf.trim_lines;

  return new Promise((res, err) => {
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

          if (trimLines) {
            drawTrimLine(doc, 0, y, docWidth, y);
          }

          // Iterate Cards
          _.forEach(row, (card, k) => {
            let x = k * cardWidth + margin;

            if (trimLines) {
              drawTrimLine(doc, x, 0, x, docHeight);
            }

            doc.image(card, x, y, {
              width: cardWidth,
              height: cardHeight
            });

            // Last Card in Row
            if (k + 1 === row.length) {
              let finalX = x + cardWidth;
              if (trimLines) {
                drawTrimLine(doc, finalX, 0, finalX, docHeight);
              }
            }
          });

          // Last Row on Page
          if (j + 1 === rows.length) {
            let finalY = y + cardHeight;
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

const drawTrimLine = (doc, startX, startY, endX, endY) => {
  doc
    .moveTo(startX, startY)
    .lineWidth(0.5)
    .lineTo(endX, endY)
    .dash(5)
    .stroke("#ccc");
};
