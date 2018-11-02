import miss from "mississippi";

export const nullStream = () =>
  miss.through.obj(async (c, e, cb) => {
    cb(null);
  });
