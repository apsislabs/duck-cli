import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import minimist from "minimist";
import { extname, join, resolve } from "path";
import { BuildCmdArgs, CardData, DeckName } from "./types.js";

import { globby, globbySync } from "globby";
import { flatMap } from "lodash-es";
import { loadConfig } from "./lib/config.js";
import { loadData } from "./lib/data.js";
import { renderHtml, renderJsx } from "./lib/render.js";
import { mkdirp } from "./utils/fs.js";
import { DEFAULT_PATH, OUT_DIR_NAME, TPL_DIR_NAME } from "./constants.js";

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
    const { template, path } = loadTemplate(root, deck);
    const styles = loadStyles(root, deck);
    const tplType = extname(path);

    console.log(`Rendering ${deck} from ${path}...`);

    if (tplType === ".jsx" || tplType === ".tsx") {
      renders[deck] = await renderJsx(
        template,
        data,
        deck,
        cachedir,
        config[deck],
        styles
      );
    } else {
      renders[deck] = await renderHtml(
        template,
        data,
        deck,
        config[deck],
        styles
      );
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

const loadTemplate = (root: string, deck: DeckName) => {
  const paths = globbySync(join(root, TPL_DIR_NAME, tplPath(deck)));
  const path = paths[0];
  return { path, template: readFileSync(path, "utf8") };
};

const loadStyles = (root: string, deck: DeckName) => {
  const paths = globbySync([
    join(root, "{index,styles,style,main}.css"),
    join(root, TPL_DIR_NAME, `${deck}.css`),
  ]);

  return paths.map((p) => readFileSync(paths[0], "utf8")).join("\n");
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
