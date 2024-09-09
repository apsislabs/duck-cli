import { Options, transform } from "@swc/core";
import { writeFileSync } from "fs";
import Handlebars from "handlebars";
import { join, resolve } from "path";
import * as ReactDOMServer from "react-dom/server";
import { CardData, DeckConfig, DeckName } from "../types.js";
import { CardComponentProps } from "../main.js";
import { insToPx, ptsToPx, pxToPts } from "../utils/units.js";

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

export const renderTemplate = async (
  type: "jsx" | "html",
  tpl: string,
  data: CardData[],
  deck: DeckName,
  cachedir: string,
  config: DeckConfig,
  proof: boolean = false
) => {
  if (type === "jsx") {
    return renderJsx(tpl, data, deck, cachedir, config, proof);
  } else {
    return renderHtml(tpl, data, deck, config, proof);
  }
};

const renderJsx = async (
  jsx: string,
  data: CardData[],
  deck: DeckName,
  cachedir: string,
  config: DeckConfig,
  proof: boolean = false
) => {
  const { code } = await transform(jsx, swcrc);

  const tplPath = join(cachedir, `${deck}.cjs`);
  writeFileSync(tplPath, code);

  console.time("jsx");
  const tpl = (await import(resolve(tplPath))).default;
  const renders = data.map((d, cardIndex) => {
    const props: CardComponentProps = {
      ...d,
      cardIndex,
      deck,
      config,
    };

    return proof
      ? `${ReactDOMServer.renderToStaticMarkup(tpl.default(props))}${proofHtml(config)}`
      : ReactDOMServer.renderToStaticMarkup(tpl.default(props));
  });
  console.timeEnd("jsx");

  return renders;
};

const renderHtml = async (
  html: string,
  data: CardData[],
  deck: DeckName,
  config: DeckConfig,
  proof: boolean = false
) => {
  console.time("hbs");
  const tpl = Handlebars.compile(html);

  const renders = data.map((d, cardIndex) => {
    const props: CardComponentProps = {
      ...d,
      cardIndex,
      deck,
      config,
    };

    return proof ? `${tpl(props)}${proofHtml(config)}` : tpl(props);
  });

  console.timeEnd("hbs");
  return renders;
};

const proofHtml = (config: DeckConfig) => {
  const bleedPx = insToPx(config.bleed);
  const safePx = bleedPx * 2;
  const radiusPx = 37.5;
  const hairline = ptsToPx(1);

  return `
    <div style="position: absolute; top: ${bleedPx}px; left: ${bleedPx}px; right: ${bleedPx}px; bottom: ${bleedPx}px; outline: ${safePx}px solid rgba(100,100,100,0.5); border: ${hairline}px solid rgba(255,0,0,0.7); border-radius: ${radiusPx}px;">
    </div>
    <div style="position: absolute; top: ${safePx}px; left: ${safePx}px; right: ${safePx}px; bottom: ${safePx}px; border: ${hairline}px dashed rgba(0,0,255,0.7); border-radius: ${radiusPx / 2}px;">
    </div>
    <span style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%) rotate(-45deg); font-size: 4rem; font-family: sans-serif; font-weight: bold; opacity: .35; user-select: none; z-index: 99999;">PROOF</span>
  `;
};
