import miss from "mississippi";

export const capStream = () =>
  miss.through.obj(async (c, e, cb) => {
    cb(null);
  });
