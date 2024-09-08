import DataURIASync from "datauri/sync.js";
import { join } from "path";
import { ASSET_DIR_NAME } from "../constants.js";

import { existsSync, mkdirSync } from "fs";

export const loadAsset = (root: string, fileName: string) => {
  return DataURIASync(join(root, ASSET_DIR_NAME, fileName)).content;
};

export const mkdirp = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};
