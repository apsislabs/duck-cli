import { globby } from "globby";
import path from "path";
import fsp from "./fsp.js";
import { transformFile } from "@swc/core";

export const transformDir = async (src, dest, options) => {
  src = path.resolve(src);
  dest = path.resolve(dest);

  if (!(await fsp.exists(dest))) {
    await fsp.mkdir(dest);
  }

  const t = (file) => {
    return transform(file, src, dest, {
      filename: file,
      ...options,
    });
  };

  return globby("**/*.js", {
    cwd: src,
  }).then((files) => {
    return Promise.all(files.map(t));
  });
};

export const transform = async (
  file,
  src,
  dest,
  { config = {}, onFile } = {}
) => {
  const filePath = path.join(src, file);
  const destPath = path.join(dest, file);
  const { code } = await transformFile(filePath, {
    jsc: {
      parser: {
        syntax: "ecmascript",
        jsx: true,
      },
    },
    ...config,
  });

  return fsp.writeWithDirs(destPath, code).then(() => {
    onFile && onFile(file);
  });
};
