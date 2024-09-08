declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

export type DeckName = Branded<string, "deck">;

export type OutputFormat = "png" | "pdf" | "svg";

export type PdfConfig = {
  layout: "letter";
  trim_lines: boolean;
  bleed: number;
};

export type DeckConfig = {
  width: number;
  height: number;
  backgroundColor?: string;
  pdf?: PdfConfig;
  format: OutputFormat[];
};

export type CardData = Record<string, string | number>;

export type BuildCmdArgs = {
  path?: string;
  decks?: DeckName[];
};
