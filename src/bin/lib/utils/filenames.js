import path from "path";
import _ from "lodash";

export const pdfname = (templateStr, deck, outDir) => {
  let tpl = _.template(templateStr);
  let filename = tpl({ deck, cardIndex: "pdf" });
  return fullPath(outDir, `${filename}.pdf`);
};

export const pngname = (templateStr, deck, cardIndex, outDir) => {
  let tpl = _.template(templateStr);
  let filename = tpl({ deck, cardIndex: pad(cardIndex, 3) });
  return fullPath(outDir, `${filename}.png`);
};

const fullPath = (o, f) => path.join(o, f);

function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}
