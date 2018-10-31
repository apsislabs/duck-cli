import fs, { writeFile } from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { promisify } from "util";

const readJson = (p, cb) => {
  fs.readFile(path.resolve(p), (err, data) => {
    if (err) cb(err);
    else cb(null, JSON.parse(data));
  });
};

const writeWithDirs = (dest, content, cb) => {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    mkdirp.sync(destDir);
  }

  fs.writeFile(dest, content, cb);
};

export default {
  mkdirp: promisify(mkdirp),
  readJson: promisify(readJson),
  exists: promisify(fs.exists),
  mkdir: promisify(fs.mkdir),
  writeFile: promisify(fs.writeFile),
  writeWithDirs: promisify(writeWithDirs),
  readFile: promisify(fs.readFile),
  unlink: promisify(fs.unlink),
  rmdir: promisify(fs.rmdir)
};
