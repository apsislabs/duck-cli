const globby = require("globby");
const path = require("path");
import fsp from "./fsp";
import { transformFileAsync } from "@babel/core";

export const transformDir = async (src, dest, options) => {
  src = path.resolve(src);
  dest = path.resolve(dest);

  if (!(await fsp.exists(dest))) {
    await fsp.mkdir(dest);
  }

  const t = file => {
    return transform(file, src, dest, {
      filename: file,
      ...options
    });
  };

  return globby("**/*.js", {
    cwd: src
  }).then(files => {
    return Promise.all(files.map(t));
  });
};

export const transform = async (file, src, dest, { babel, onFile } = {}) => {
  const filePath = path.join(src, file);
  const destPath = path.join(dest, file);
  const { code } = await transformFileAsync(filePath, babel);
  return fsp.writeFile(destPath, code).then(() => {
    onFile && onFile(file);
  });
};
