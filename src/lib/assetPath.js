import { sync as DataURI } from "datauri";
import { resolve, join } from "path";
import { ASSET_FOLDER } from "../bin/lib/constants";
import fs from "fs";

export const assetPath = p => {
  return resolve(join(ASSET_FOLDER, p)).toString();
};

export const assetBuffer = p => {
  return fs.readFileSync(assetPath(p), "utf-8");
};

export const asset = p => {
  return DataURI(assetPath(p));
};
