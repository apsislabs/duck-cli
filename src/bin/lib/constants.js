import { resolve } from "path";

export const TMP_FOLDER = "_tmp";
export const TMP_REGEX = new RegExp(`${resolve(`./${TMP_FOLDER}`)}.*`);
export const DATA_FOLDER = "data";
export const TEMPLATE_FOLDER = "templates";
export const ASSET_FOLDER = "assets";
export const CONF_FILE = "decks.config.yml";
export const REQUIRED_SUBDIRS = [DATA_FOLDER, TEMPLATE_FOLDER, CONF_FILE];
