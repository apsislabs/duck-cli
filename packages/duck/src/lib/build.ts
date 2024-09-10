import { extname, join, resolve } from "path/posix";
import { OUT_DIR_NAME } from "../constants.js";
import { CardData, DeckConfig, DeckName, RenderResult } from "../types.js";
import { mkdirp } from "../utils/fs.js";
import { loadStyles, loadTemplate } from "../utils/loaders.js";
import { loadConfig } from "./config.js";
import { loadData } from "./data.js";
import { renderJpegs, renderPngs } from "./render.js";
import { saveRenders } from "./save.js";
import { renderTemplate } from "./template.js";

const JSX_TEMPLATE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

export const buildDir = async (
  path: string,
  proof: boolean = false,
  onlyDecks?: DeckName[]
) => {
  console.time("duck");

  const root = resolve(path);
  const config = loadConfig(root, onlyDecks);
  const data = loadData(root, config);

  const outdir = join(root, OUT_DIR_NAME);
  const cachedir = join(root, ".duck");

  // Make necessary directories
  mkdirp(cachedir);
  mkdirp(outdir);

  const decks = Object.entries(data) as [DeckName, CardData[]][];

  for (const [deck, data] of decks) {
    // Make deck output directory
    mkdirp(join(outdir, deck));

    const { template, path } = loadTemplate(root, deck);
    const styles = loadStyles(root, deck);

    const type = JSX_TEMPLATE_EXTENSIONS.includes(extname(path))
      ? "jsx"
      : "html";

    const result = await buildDeck(
      template,
      type,
      deck,
      data,
      config[deck],
      cachedir,
      proof,
      styles
    );

    await saveRenders(outdir, cachedir, result, deck, config[deck]);
  }

  console.timeEnd("duck");
};

export const buildDeck = async (
  template: string,
  type: "jsx" | "html",
  deck: DeckName,
  data: CardData[],
  config: DeckConfig,
  cachedir: string = "./",
  proof?: boolean,
  styles?: string
) => {
  let renderResult: RenderResult = {};

  const htmls = await renderTemplate(
    type,
    template,
    data,
    deck,
    cachedir,
    config,
    proof
  );

  if (config.format.includes("png") || config.format.includes("pdf")) {
    renderResult.pngs = await renderPngs(htmls, config, styles);
  }

  if (config.format.includes("jpg")) {
    renderResult.pngs = await renderJpegs(htmls, config, styles);
  }

  return renderResult;
};