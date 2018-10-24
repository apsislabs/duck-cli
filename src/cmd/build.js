import { build } from '../lib/build';

export const buildCommand = (projectRoot = '.') => {
  build(projectRoot);
}