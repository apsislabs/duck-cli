import { readFileSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";
import minimist from "minimist";
import { extname, join, resolve } from "path";
import { BuildCmdArgs, CardData, DeckName } from "./types.js";

import { globbySync } from "globby";
import { flatMap } from "lodash-es";
import { DEFAULT_PATH, OUT_DIR_NAME, TPL_DIR_NAME } from "./constants.js";
import { loadConfig } from "./lib/config.js";
import { loadData } from "./lib/data.js";
import { renderTemplate } from "./lib/template.js";
import { mkdirp } from "./utils/fs.js";
import { renderPdf, renderJpegs, renderPngs } from "./lib/render.js";

const getArgs = (): BuildCmdArgs => {
  const raw = minimist(process.argv);

  return {
    path: raw.path ?? DEFAULT_PATH,
    decks: raw.decks ?? undefined,
  };
};

const JSX_TEMPLATE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

const main = async () => {
  console.time("duck");
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
  // let pdfs: Record<DeckName, Uint8Array | undefined> = {};
  for (const [deck, data] of decks) {
    const { template, path } = loadTemplate(root, deck);
    const styles = loadStyles(root, deck);
    const tplType = JSX_TEMPLATE_EXTENSIONS.includes(extname(path))
      ? "jsx"
      : "html";

    console.log(`Rendering ${deck} from ${path}...`);
    const htmls = await renderTemplate(
      tplType,
      template,
      data,
      deck,
      cachedir,
      config[deck]
    );

    renders[deck] = await renderPngs(htmls, config[deck], styles);
  }

  console.time("save");
  for (const deck in renders) {
    if (Object.prototype.hasOwnProperty.call(renders, deck)) {
      const buffers = renders[deck as DeckName];
      const paths = await Promise.all(buffers.map(async (b, idx) => {
        const path = join(
          outdir,
          cardName(deck as DeckName, idx, buffers.length, "png")
        );

        await writeFile(path, b);

        return path;
      }));

      console.time("save pdf");
      await renderPdf(paths, config[deck as DeckName], outdir, "png");
      console.timeEnd("save pdf");
    }
  }
  console.timeEnd("save");

  // await Promise.all(
  //   flatMap(pdfs, async (buffer, deck) => {
  //     if (buffer) {
  //       writeFile(join(outdir, `${deck}.pdf`), buffer);
  //     }
  //   })
  // );
  console.timeEnd("duck");
};

const loadTemplate = (root: string, deck: DeckName) => {
  const paths = globbySync(
    join(root, TPL_DIR_NAME, `${deck}.{jsx,tsx,html,mu,mustache,hb,handlebars}`)
  );

  const path = paths[0];
  return { path, template: readFileSync(path, "utf8") };
};

const loadStyles = (root: string, deck: DeckName) => {
  const paths = globbySync([
    join(root, "{index,styles,style,main}.css"),
    join(root, TPL_DIR_NAME, `${deck}.css`),
  ]);

  return paths.map((p) => readFileSync(p, "utf8")).join("\n");
};

const cardName = (
  deckName: DeckName,
  cardIdx: number,
  numCards: number,
  ext: string = "png"
) =>
  `${deckName}${cardIdx.toString().padStart(numCards.toString().length, "0")}.${ext}`;

main();
