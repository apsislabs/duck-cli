import path from "path";
export const svgname = (rowIdx, output) =>
  path.join(output, `${filename(rowIdx)}.svg`);
export const pngname = (rowIdx, output) =>
  path.join(output, `${filename(rowIdx)}.png`);
const filename = rowIdx => `card_${pad(rowIdx, 2)}`;
function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}
