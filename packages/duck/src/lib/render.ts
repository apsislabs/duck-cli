import { ScreenshotOptions } from "puppeteer";
import { DeckConfig } from "../types.js";
import { withBrowser, withPage } from "../utils/puppeteer.js";

const DEFAULT_CSS = `
//
// Reset courtesy of https://www.joshwcomeau.com/css/custom-css-reset/
//

/*
  1. Use a more-intuitive box-sizing model.
*/
*, *::before, *::after {
  box-sizing: border-box;
}

/*
  2. Remove default margin
*/
* {
  margin: 0;
}

/*
  Typographic tweaks!
  3. Add accessible line-height
  4. Improve text rendering
*/
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/*
  5. Improve media defaults
*/
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/*
  6. Remove built-in form typography styles
*/
input, button, textarea, select {
  font: inherit;
}

/*
  7. Avoid text overflows
*/
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/*
  8. Create a root stacking context
*/
#root, #__duck {
  isolation: isolate;
}
`;

export const renderJpegs = async (
  renders: string[],
  config: DeckConfig,
  styles?: string,
) => {
  console.time("jpg");
  const imgs = await renderImages(
    renders,
    config,
    { type: "jpeg", quality: 100 },
    styles,
  );
  console.timeEnd("jpg");
  return imgs;
};

export const renderPngs = async (
  renders: string[],
  config: DeckConfig,
  styles?: string,
) => {
  console.time("png");
  const imgs = await renderImages(renders, config, { type: "png" }, styles);
  console.timeEnd("png");

  return imgs;
};

const renderImages = async (
  renders: string[],
  config: DeckConfig,
  options?: ScreenshotOptions,
  styles?: string,
) => {
  const { width, height } = config;
  const clip = { x: 0, y: 0, width, height };
  const viewport = { width, height };
  const opts = {
    ...options,
    clip,
  };

  const pngs = await withBrowser(async (browser) => {
    return await withPage(browser, async (page) => {
      let out = [];
      for (const html of renders) {
        await page.setContent(`<div id="__duck">${html}</div>`);

        page.addStyleTag({ content: DEFAULT_CSS });

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
