import { chunk, times } from "lodash-es";
import { Recipe } from "muhammara";
import { join, resolve } from "path";
import puppeteer from "puppeteer";
import { PAGE_SIZES } from "../constants.js";
import { DeckConfig } from "../types.js";
import { withBrowser, withPage } from "../utils/puppeteer.js";
import { insToPts, pxToPts } from "../utils/units.js";

export const renderJpegs = async (
  renders: string[],
  config: DeckConfig,
  styles?: string
) => {
  console.time("jpg");
  const imgs = await renderImages(
    renders,
    config,
    { type: "jpeg", quality: 100 },
    styles
  );
  console.timeEnd("jpg");
  return imgs;
};

export const renderPngs = async (
  renders: string[],
  config: DeckConfig,
  styles?: string
) => {
  console.time("png");
  const imgs = await renderImages(renders, config, { type: "png" }, styles);
  console.timeEnd("png");

  return imgs;
};

const renderImages = async (
  renders: string[],
  config: DeckConfig,
  options?: puppeteer.ScreenshotOptions,
  styles?: string
) => {
  const { width, height } = config;
  const clip = { x: 0, y: 0, width, height };
  const viewport = { width, height };
  const opts = {
    omitBackground: true,
    ...options,
    clip,
  };

  const pngs = await withBrowser(async (browser) => {
    return await withPage(browser, async (page) => {
      let out = [];
      for (const html of renders) {
        await page.setContent(html);

        if (styles) {
          page.addStyleTag({ content: styles });
        }

        await page.setViewport(viewport);

        out.push(await page.screenshot(opts));
      }

      return out;
    });
  });

  return pngs;
};

const invert = (v: [number, number]): [number, number] => [v[1], v[0]];

export const renderPdf = async (
  imgPaths: string[],
  config: DeckConfig,
  outdir: string,
  imgType: "png" | "jpg" = "png"
) => {
  if (!config.pdf) {
    return;
  }

  let {
    layout = "landscape",
    size = "letter",
    margin = 0.125,
    bleed,
  } = config.pdf;

  const pageSize =
    layout === "landscape" ? PAGE_SIZES[size] : invert(PAGE_SIZES[size]);

  const recipe = new Recipe("new", resolve(join(outdir, "out.pdf")));

  // Get and crop images, if needed
  let cardWidthPx = config.width;
  let cardHeightPx = config.height;

  if (bleed) {
    cardWidthPx = cardWidthPx - bleed * 2;
    cardHeightPx = cardHeightPx - bleed * 2;
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
