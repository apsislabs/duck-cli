import fs from 'fs';
import { promisify } from "util";

export default {
  exists: promisify(fs.exists),
  mkdir: promisify(fs.mkdir),
  writeFile: promisify(fs.writeFile),
  readFile: promisify(fs.readFile),
  unlink: promisify(fs.unlink),
  rmdir: promisify(fs.rmdir),
}