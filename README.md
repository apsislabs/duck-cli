🦆

## Design

- There are 3 packages:

  - duck/core: exposes functions for doing deck transforms

    - core function is `renderDeck(html: string; data: Object[]; config: DeckConfig): Buffer[]`
    - also exposes functions for:

      - rendering a project directory
      - parsing config JSON
      - processing CSV with an asset directory

    - supports mustache (html/hbs/handlebars/mu/mustache) and React templating (jsx/tsx)
    - hard requirements:
      - all multi-child containers must be flex
      - no CSS — only inline styles

  - duck/cli: the build tool

    - responsible for taking a project directory and handing it to `duck/core`

  - duck/create-duck-game: the project scaffolder

## TODO

- [x] Move templates to create dir
- [x] Fix print-n-play PDF generation
- [x] Add support for stylesheet per deck
- [x] Add ability to proof
- [x] Export Card type for TSX
- [x] Fix cropping
- [x] Obey export types
- [x] Output PDF with correct name, images to subdir
- [x] Restore all relevant v1 options
- [x] Split CLI and core
- [ ] Write create-duck cli
- [ ] Clean up all the templates
- [ ] Switch from yaml config to json config with $schema
- [ ] Add tests
