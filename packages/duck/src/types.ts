declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };
export type Branded<T, B> = T & Brand<B>;

export type DeckName = Branded<string, "deck">;

export type OutputFormat = "png" | "pdf" | "jpg";

export type PaperSize =
  | "executive"
  | "folio"
  | "legal"
  | "letter"
  | "ledger"
  | "tabloid"
  | "a0"
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "a5"
  | "a6"
  | "a7"
  | "a8"
  | "a9"
  | "a10"
  | "b0"
  | "b1"
  | "b2"
  | "b3"
  | "b4"
  | "b5"
  | "b6"
  | "b7"
  | "b8"
  | "b9"
  | "b10"
  | "c0"
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "c6"
  | "c7"
  | "c8"
  | "c9"
  | "c10"
  | "ra0"
  | "ra1"
  | "ra2"
  | "ra3"
  | "ra4"
  | "sra0"
  | "sra1"
  | "sra2"
  | "sra3"
  | "sra4";

export type PdfConfig = {
  layout: "landscape" | "portrait";
  size: PaperSize;
  margin: number;
  trim_lines: boolean;
};

export type DeckConfig = {
  width: number;
  height: number;
  backgroundColor?: string;
  bleed: number;
  pdf?: PdfConfig;
  format: OutputFormat[];
};

export type CardData = Record<string, string | number>;

export type RenderResult = {
  pngs?: Uint8Array[];
  jpgs?: Uint8Array[];
};

export type CardComponentProps<DataType extends unknown = unknown> =
  DataType & {
    [key: string]: any;
    cardIndex: number;
    deck: DeckName;
    config: DeckConfig;
  };

