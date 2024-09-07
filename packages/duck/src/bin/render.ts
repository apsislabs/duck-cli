import { Options, transform } from "@swc/core";
import { writeFileSync } from "fs";
import Handlebars from "handlebars";
import { join, resolve } from "path";
import puppeteer from "puppeteer";
import * as ReactDOMServer from "react-dom/server";
import { CardData, DeckConfig, DeckName } from "../types.js";
import { withBrowser, withPage } from "./puppeteer.js";

const swcrc: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
  module: {
    type: "commonjs",
  },
  minify: false,
};

export const renderJsx = async (
  jsx: string,
  data: CardData[],
  deck: DeckName,
  cachedir: string,
  config: DeckConfig
) => {
  const { code } = await transform(jsx, swcrc);

  const tplPath = join(cachedir, `${deck}.cjs`);
  writeFileSync(tplPath, code);

  console.time("jsx");
  const tpl = (await import(resolve(tplPath))).default;
  const renders = data.map((d, cardIndex) =>
    ReactDOMServer.renderToStaticMarkup(
      tpl.default({
        ...d,
        cardIndex,
        deck,
        config,
      })
    )
  );
  console.timeEnd("jsx");

  return await renderJpegs(renders, config);
};

export const renderHtml = async (
  html: string,
  data: CardData[],
  deck: DeckName,
  config: DeckConfig
) => {
  console.time("hbs");
  const tpl = Handlebars.compile(html);
  const renders = data.map((d, cardIndex) =>
    tpl({ ...d, cardIndex, deck, config })
  );
  console.timeEnd("hbs");

  return await renderJpegs(renders, config);
};

const renderJpegs = async (renders: string[], config: DeckConfig) => {
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
          await page.setViewport(viewport);

          return await page.screenshot(options);
        })
      );
    });
  });

  console.timeEnd("png");

  return pngs;
};
