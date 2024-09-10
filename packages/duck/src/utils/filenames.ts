import { compact } from "lodash-es";
import { DeckName } from "../types.js";

export const cardName = (
  deckName: DeckName,
  cardIdx: number,
  numCards: number,
  ext: string = "png",
  prefix: string = ""
) => `${compact([
  deckName,
  prefix,
  cardIdx.toString().padStart(numCards.toString().length, "0"),
]).join("_")}.${ext}`;
