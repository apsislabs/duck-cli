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

type SystemFontDefinition = {
  name: string;
  path?: never;
};

type LocalFontDefinition = {
  name: string;
  path: string;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style?: "normal" | "italic";
};

export type FontDefinition = SystemFontDefinition | LocalFontDefinition;

export type DeckConfig = {
  width: number;
  height: number;
  backgroundColor?: string;
  pdf?: PdfConfig;
  fonts?: FontDefinition[];
  format: OutputFormat[];
};

export type CardData = Record<string, string | number>;

export type BuildCmdArgs = {
  path?: string;
  decks?: DeckName[];
};
