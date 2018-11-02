import ProgressBar from "ascii-progress";

export const progressBar = (title, total) => {
  return new ProgressBar({
    schema: `${title}\t[:bar] :current/:total :percent :elapseds :etas`,
    filled: "=",
    total: total
  });
};
