import { readFileSync } from "fs";
import { globbySync } from "globby";
import { join } from "path";
import { TPL_DIR_NAME } from "../constants.js";
import { DeckName } from "../types.js";

export const loadTemplate = (root: string, deck: DeckName) => {
  const paths = globbySync(
    join(
      root,
      TPL_DIR_NAME,
      `${deck}.{jsx,tsx,html,mu,mustache,hb,handlebars}`,
    ),
  );

  const path = paths[0];
  return { path, template: readFileSync(path, "utf8") };
};
export const loadStyles = (root: string, deck: DeckName) => {
  const paths = globbySync([
    join(root, "{index,styles,style,main}.css"),
    join(root, TPL_DIR_NAME, `${deck}.css`),
  ]);

  return paths.map((p) => readFileSync(p, "utf8")).join("\n");
};
