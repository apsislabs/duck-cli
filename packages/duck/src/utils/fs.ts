import DataURIASync from "datauri/sync.js";
import { join } from "path";
import { ASSET_DIR_NAME } from "../constants.js";

import { existsSync, mkdirSync } from "fs";
import { unlink } from "fs/promises";
import { resolve } from "path/posix";

export const loadAsset = (root: string, fileName: string) => {
  return DataURIASync(join(root, ASSET_DIR_NAME, fileName)).content;
};

export const mkdirp = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};
export const deleteImages = async (paths: string[]) => await Promise.all(paths.map((p) => unlink(resolve(p))));
