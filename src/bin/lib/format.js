import { createConverter } from "convert-svg-to-png";
import path from "path";
import rimraf from "rimraf";
import { formatPdf } from "./formatters/formatPdf";
import { formatPng } from "./formatters/formatPng";
import { formatSvg } from "./formatters/formatSvg";
import { pngname } from "./utils/filenames";
import ProgressBar from "progress";
import fsp from "./utils/fsp";

export const formatCards = async (projectRoot, config, data, renderings) => {
  for (const deckKey in config) {
    await formatDeck(
      projectRoot,
      config[deckKey],
      renderings[deckKey],
      deckKey
    );
  }
};

const formatDeck = async (projectRoot, config, renderings, deckKey) => {
  const output = await deckFolder(projectRoot, deckKey);

  const svg = config.format.includes("svg");
  const png = config.format.includes("png");
  const pdf = config.format.includes("pdf");

  const promises = [];
  const pngPaths = [];
  const converter = createConverter();

  const svgBar = new ProgressBar("Render SVG :bar (:current/:total)", {
    total: renderings.length
  });

  const pngBar = new ProgressBar("Render PNG :bar (:current/:total)", {
    total: renderings.length
  });

  try {
    for (let i = 0; i < renderings.length; i++) {
      if (svg) {
        promises.push(
          formatSvg(renderings[i], i, output).then(() => svgBar.tick())
        );
      }

      if (png || pdf) {
        pngPaths.push(pngname(i, output));
        await formatPng(converter, renderings[i], i, output).then(() =>
          pngBar.tick()
        );
      }
    }

    if (pdf) {
      await formatPdf(pngPaths, output, config);
    }
  } finally {
    converter.destroy();
  }

  await Promise.all(promises);
};

const deckFolder = async (projectRoot, deckKey) => {
  const output = path.join(projectRoot, "output");
  const folder = path.join(output, deckKey);

  if (!(await fsp.exists(output))) {
    await fsp.mkdir(output);
  }

  if (await fsp.exists(folder)) {
    rimraf.sync(folder);
  }
  if (!(await fsp.exists(folder))) {
    await fsp.mkdir(folder);
  }

  return folder;
};
