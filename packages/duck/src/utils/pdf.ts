import { chunk, times } from "lodash-es";
import { Recipe } from "muhammara";
import { resolve, join } from "path/posix";
import { PAGE_SIZES } from "../constants.js";
import { DeckConfig, DeckName } from "../types.js";
import { insToPx, insToPts, pxToPts } from "./units.js";

const invert = (v: [number, number]): [number, number] => [v[1], v[0]];

export const formatPdf = async (
  imgPaths: string[],
  config: DeckConfig,
  outdir: string,
  deck: DeckName
) => {
  if (!config.pdf) {
    return;
  }

  let { layout = "landscape", size = "letter", margin = 0.125 } = config.pdf;

  const pageSize = layout === "landscape" ? PAGE_SIZES[size] : invert(PAGE_SIZES[size]);

  const recipe = new Recipe("new", resolve(join(outdir, deck, `${deck}.pdf`)));

  // Get and crop images, if needed
  let cardWidthPx = config.width;
  let cardHeightPx = config.height;

  if (config.bleed) {
    cardWidthPx = cardWidthPx - insToPx(config.bleed) * 2;
    cardHeightPx = cardHeightPx - insToPx(config.bleed) * 2;
  }

  // Calculate all layout values
  const marginPts = insToPts(margin);
  const docWidth = pageSize[0];
  const docHeight = pageSize[1];
  const cardWidthPts = pxToPts(cardWidthPx);
  const cardHeightPts = pxToPts(cardHeightPx);
  const pageWidth = docWidth - marginPts * 2; // width less margin
  const pageHeight = docHeight - marginPts * 2; // width less margin
  const cardsPerRow = Math.floor(pageWidth / cardWidthPts);
  const rowsPerPage = Math.floor(pageHeight / cardHeightPts);
  const rows = chunk(imgPaths, cardsPerRow);
  const pages = chunk(rows, rowsPerPage);
  const trimLines = config.pdf.trim_lines;

  console.time("pdf");

  // Iterate Pages
  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const page = pages[pageIdx];
    recipe.createPage(pageSize[0], pageSize[1]);

    // Iterate Rows
    for (let rowIdx = 0; rowIdx < page.length; rowIdx++) {
      const row = page[rowIdx];
      let y = rowIdx * cardHeightPts + marginPts;

      // Iterate Cards
      for (let cardIdx = 0; cardIdx < row.length; cardIdx++) {
        const card = row[cardIdx];
        const x = cardIdx * cardWidthPts + marginPts;

        recipe.image(card, x, y, {
          width: cardWidthPts,
          height: cardHeightPts,
        });
      }
    }

    // Draw guides
    if (trimLines) {
      drawGuides(
        recipe,
        pageSize,
        rowsPerPage,
        cardsPerRow,
        cardWidthPts,
        cardHeightPts,
        marginPts
      );
    }

    recipe.endPage();
  }

  recipe.endPDF();
  console.timeEnd("pdf");
};
const drawGuides = (
  recipe: Recipe,
  pageSize: [number, number],
  rowsPerPage: number,
  cardsPerRow: number,
  cardWidthPts: number,
  cardHeightPts: number,
  margin: number
) => {
  const [width, height] = pageSize;
  const lineParams = { dash: [3, 3], color: "#cccccc", lineWidth: 0.5 };

  times(rowsPerPage + 1, (rowIdx) => {
    const y = rowIdx * cardHeightPts + margin;

    // Draw horizontal guide
    recipe.line(
      [
        [0, y],
        [width, y],
      ],
      lineParams
    );

    if (rowIdx === 0) {
      times(cardsPerRow + 1, (cardIdx) => {
        const x = cardIdx * cardWidthPts + margin;

        // Draw vertical guide
        recipe.line(
          [
            [x, 0],
            [x, height],
          ],
          lineParams
        );
      });
    }
  });
};
