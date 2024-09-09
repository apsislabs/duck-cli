import { Options, transform } from "@swc/core";
import { writeFileSync } from "fs";
import Handlebars from "handlebars";
import { join, resolve } from "path";
import * as ReactDOMServer from "react-dom/server";
import { CardData, DeckConfig, DeckName } from "../types.js";
import { CardComponentProps } from "../main.js";

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
  config: DeckConfig
) => {
  if (type === "jsx") {
    return renderJsx(tpl, data, deck, cachedir, config);
  } else {
    return renderHtml(tpl, data, deck, config);
  }
};

const renderJsx = async (
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
  const renders = data.map((d, cardIndex) => {
    const props: CardComponentProps = {
      ...d,
      cardIndex,
      deck,
      config,
    };
    return ReactDOMServer.renderToStaticMarkup(tpl.default(props));
  });
  console.timeEnd("jsx");

  return renders;
};

const renderHtml = async (
  html: string,
  data: CardData[],
  deck: DeckName,
  config: DeckConfig
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

    return tpl(props);
  });

  console.timeEnd("hbs");
  return renders;
};
