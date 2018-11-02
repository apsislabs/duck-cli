import { sync as DataURI } from "datauri";
import { resolve, join } from "path";
import { ASSET_FOLDER } from "../bin/lib/constants";

export const asset = p => {
  const path = resolve(join(ASSET_FOLDER, p)).toString();
  return DataURI(path);
};
