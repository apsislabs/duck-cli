import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import minimist from "minimist";
import { extname, join, resolve } from "path";
import { BuildCmdArgs, CardData, DeckName } from "./types.js";

import { globby } from "globby";
import { flatMap } from "lodash-es";
import { loadConfig } from "./bin/config.js";
import { loadData } from "./bin/data.js";
import { renderHtml, renderJsx } from "./bin/render.js";
import { mkdirp } from "./bin/utils.js";

export const DEFAULT_PATH = "./";

export const IMAGE_COLUMN_PREFIX = "$";
export const MD_COLUMN_PREFIX = "_";

export const ASSET_DIR_NAME = "assets";
export const DATA_DIR_NAME = "data";
export const OUT_DIR_NAME = "output";
export const TPL_DIR_NAME = "templates";

const getArgs = (): BuildCmdArgs => {
  const raw = minimist(process.argv);

  return {
    path: raw.path ?? DEFAULT_PATH,
    decks: raw.decks ?? undefined,
  };
};

const main = async () => {
  const args = getArgs();
  const root = resolve(args.path ?? DEFAULT_PATH);
  const config = loadConfig(root, args);
  const data = loadData(root, config);

  const outdir = join(root, OUT_DIR_NAME);
  const cachedir = join(root, ".duck");

  // Make necessary directories
  mkdirp(cachedir);
  mkdirp(outdir);

  const decks = Object.entries(data) as [DeckName, CardData[]][];
  let renders: Record<DeckName, Uint8Array[]> = {};
  for (const [deck, data] of decks) {
    const { template, path } = await loadTemplate(root, deck);
    const tplType = extname(path);
    console.log(`Rendering ${deck} from ${path}...`);

    if (tplType === ".jsx" || tplType === ".tsx") {
      renders[deck] = await renderJsx(
        template,
        data,
        deck,
        cachedir,
        config[deck]
      );
    } else {
      renders[deck] = await renderHtml(template, data, deck, config[deck]);
    }
  }

  console.time("save");
  await Promise.all(
    flatMap(renders, (buffers, deck) => {
      buffers.map((b, idx) =>
        writeFile(
          join(outdir, cardName(deck as DeckName, idx, buffers.length, "jpg")),
          b
        )
      );
    })
  );
  console.timeEnd("save");
};

const loadTemplate = async (root: string, deck: DeckName) => {
  const paths = await globby(join(root, TPL_DIR_NAME, tplPath(deck)));
  const path = paths[0];
  return { path, template: readFileSync(path, "utf8") };
};

const tplPath = (deck: DeckName) =>
  `${deck}.{jsx,tsx,html,mu,mustache,hb,handlebars}`;

const cardName = (
  deckName: DeckName,
  cardIdx: number,
  numCards: number,
  ext: string = "png"
) =>
  `${deckName}${cardIdx.toString().padStart(numCards.toString().length, "0")}.${ext}`;

main();
