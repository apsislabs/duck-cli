import { resolve, join } from "path";
import { ASSET_FOLDER } from "../bin/lib/constants";

export const asset = p => {
  return resolve(join(ASSET_FOLDER, p)).toString();
};
