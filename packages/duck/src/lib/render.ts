import puppeteer from "puppeteer";
import { DeckConfig } from "../types.js";
import { withBrowser, withPage } from "../utils/puppeteer.js";

export const renderJpegs = async (
  renders: string[],
  config: DeckConfig,
  styles?: string
) => {
  const { width, height } = config;
  const clip = { x: 0, y: 0, width, height };
  const viewport = { width, height };
  const options: puppeteer.ScreenshotOptions = {
    type: "jpeg",
    quality: 100,
    clip,
    omitBackground: true,
  };

  console.time("png");

  const pngs = await withBrowser(async (browser) => {
    return await withPage(browser, async (page) => {
      return Promise.all(
        renders.map(async (html) => {
          await page.setContent(html);

          if (styles) {
            page.addStyleTag({ content: styles });
          }

          await page.setViewport(viewport);

          return await page.screenshot(options);
        })
      );
    });
  });

  console.timeEnd("png");

  return pngs;
};
