import Jimp from "jimp";
import miss from "mississippi";
import { progressBar } from "../utils/progressBar";

export const cropStream = ({ config, size = 0 }) => {
  let pngBuffers = [];
  const cropBar = progressBar("Crop", size);
  return miss.through.obj(
    async (chunk, enc, cb) => {
      if (config.pdf.bleed) {
        let croppedBuffer = await Jimp.read(chunk).then(i => {
          cropBar.tick();
          return i.crop(5, 5, 200, 200).getBufferAsync(Jimp.MIME_PNG);
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
