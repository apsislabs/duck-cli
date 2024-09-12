import sharp from "sharp";
import { DeckConfig } from "../types.js";
import { insToPx } from "../utils/units.js";

export const crop = async (buffers: Uint8Array[], config: DeckConfig) => {
  const bleedPx = Math.ceil(insToPx(config.bleed));
  const width = config.width - bleedPx * 2;
  const height = config.width - bleedPx * 2;

  console.time("crop");
  const cropped = await Promise.all(
    buffers.map((b) =>
      sharp(b)
        .extract({ left: bleedPx, top: bleedPx, width, height })
        .toBuffer(),
    ),
  );
  console.timeEnd("crop");

  return cropped;
};
