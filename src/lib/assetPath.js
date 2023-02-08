const Datauri = import('datauri/sync');
import fs from "fs";
import { join, resolve } from "path";
import { ASSET_FOLDER } from "../bin/lib/constants.js";

export const assetPath = p => {
  return resolve(join(ASSET_FOLDER, p)).toString();
};

export const assetBuffer = p => {
  return fs.readFileSync(assetPath(p), "utf-8");
};

export const asset = p => {
  return Datauri(assetPath(p));
};
