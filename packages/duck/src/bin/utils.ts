import DataURIASync from "datauri/sync.js";
import { parse, join, extname, basename } from "path";
import { ASSET_DIR_NAME } from "../main.js";

import fontManager from "node-system-fonts";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { Font, FontWeight } from "satori";
import {
  FontDefinition,
  LocalFontDefinition,
  SystemFontDefinition,
} from "../types.js";

const VALID_FONT_EXTENSIONS = [".ttf", ".otf", ".woff"];

export const loadAsset = (root: string, fileName: string) => {
  return DataURIASync(join(root, ASSET_DIR_NAME, fileName)).content;
};

export const loadFont = async (font: FontDefinition): Promise<Font[]> => {
  if (font.path) {
    return await loadLocalFont(font);
  } else {
    return await loadSystemFont(font as SystemFontDefinition);
  }
};

const loadSystemFont = async (font: SystemFontDefinition): Promise<Font[]> => {
  var fonts = fontManager.findFontsSync({ family: font.name });
  var italicFonts = fontManager.findFontsSync({
    family: font.name,
    italic: true,
  });

  return [...fonts, ...italicFonts]
    .filter((f) =>
      VALID_FONT_EXTENSIONS.includes(extname(f.path).toLowerCase())
    )
    .map((f) => ({
      data: readFileSync(f.path),
      name: font.name,
      weight: f.weight as FontWeight,
      style: f.italic ? "italic" : "normal",
    }));
};

const loadLocalFont = async (font: LocalFontDefinition): Promise<Font[]> => {
  return [
    {
      data: readFileSync(font.path),
      ...font,
    },
  ];
};

export const mkdirp = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};
