import Jimp from "jimp";
import miss from "mississippi";
import { progressBar } from "../utils/progressBar";

export const cropStream = ({ config, size = 0, deckKey = "" }) => {
  let pngBuffers = [];
  const cropBar = progressBar(`[${deckKey}] Crop`, size);
  const {
    pdf: { bleed },
    width,
    height
  } = config;

  return miss.through.obj(
    async (chunk, enc, cb) => {
      if (bleed) {
        let cardWidthPx = width - bleed * 2;
        let cardHeightPx = height - bleed * 2;

        let croppedBuffer = await Jimp.read(chunk).then(img => {
          cropBar.tick();

          return img
            .crop(bleed, bleed, cardWidthPx, cardHeightPx)
            .getBufferAsync(Jimp.MIME_PNG);
        });

        pngBuffers.push(croppedBuffer);
      } else {
        pngBuffers.push(chunk);
      }

      cb(null, null);
    },
    cb => {
      cb(null, pngBuffers);
    }
  );
};
