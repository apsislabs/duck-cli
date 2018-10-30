import fs from "fs";
import path from "path";
import { promisify } from "util";

var readJson = (p, cb) => {
  fs.readFile(path.resolve(p), (err, data) => {
    if (err) cb(err);
    else cb(null, JSON.parse(data));
  });
};

export default {
  readJson: promisify(readJson),
  exists: promisify(fs.exists),
  mkdir: promisify(fs.mkdir),
  writeFile: promisify(fs.writeFile),
  readFile: promisify(fs.readFile),
  unlink: promisify(fs.unlink),
  rmdir: promisify(fs.rmdir)
};
