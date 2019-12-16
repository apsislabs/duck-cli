import Jimp from "jimp";
import miss from "mississippi";
import ora from "ora";
import chalk from "chalk";

export const cropStream = ({ config, size = 0, deckKey = "" }) => {
  const spinner = ora(`[${chalk.cyan(deckKey)}]\tCropping PNGs`).start();

  let pngBuffers = [];

  const {
    pdf: { bleed },
    width,
    height
  } = config;

  return miss.through.obj(
    async (chunk, _enc, cb) => {
      if (bleed) {
        let cardWidthPx = width - bleed * 2;
        let cardHeightPx = height - bleed * 2;

        let croppedBuffer = await Jimp.read(chunk).then(img => {
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
      spinner.succeed();
      cb(null, pngBuffers);
    }
  );
};
