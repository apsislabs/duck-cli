import { writeFile } from "fs/promises";
import { join } from "path/posix";
import { crop } from "./crop.js";
import { formatPdf } from "../utils/pdf.js";
import { cardName } from "../utils/filenames.js";
import { DeckName, DeckConfig, RenderResult } from "../types.js";
import { deleteImages } from "../utils/fs.js";

export const saveRenders = async (
  outdir: string,
  cachedir: string,
  renders: RenderResult,
  deck: DeckName,
  config: DeckConfig
) => {
  // Save PNGs
  if (config.format.includes("png") && renders.pngs) {
    await saveImages(renders.pngs, outdir, deck as DeckName, "png");
  }

  // Save JPGs
  if (config.format.includes("jpg") && renders.jpgs) {
    await saveImages(renders.jpgs, outdir, deck as DeckName, "jpg");
  }

  // Save PDF
  if (config.format.includes("pdf") && config.pdf &&  renders.pngs || renders.jpgs) {
    const images = renders.pngs ?? renders.jpgs;

    if (images) {
      const cropExt = renders.pngs ? "png" : "jpg";
      const croppedBuffers = await crop(images, config);
      const croppedPaths = await saveImages(
        croppedBuffers,
        cachedir,
        deck as DeckName,
        cropExt,
        "crop"
      );

      await formatPdf(croppedPaths, config, outdir, deck as DeckName);

      deleteImages(croppedPaths);
    }
  }
};

const saveImages = async (
  buffers: Uint8Array[],
  outdir: string,
  deck: DeckName,
  ext: "png" | "jpg" = "png",
  prefix: string = ""
) => {
  console.time(`save ${ext}`);

  const paths = await Promise.all(
    buffers.map(async (b, idx) => {
      const path = join(
        outdir,
        deck,
        ext,
        cardName(deck as DeckName, idx, buffers.length, ext, prefix)
      );

      await writeFile(path, b);

      return path;
    })
  );

  console.timeEnd(`save ${ext}`);

  return paths;
};
