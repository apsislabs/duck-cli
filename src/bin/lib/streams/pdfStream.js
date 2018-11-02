import miss from "mississippi";
import { formatPdf } from "../formatters/formatPdf";

export const pdfStream = ({ output, config }) =>
  miss.through.obj(async (c, e, cb) => {
    await formatPdf(c, output, config);
    cb(null);
  });
