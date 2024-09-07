🦆


## Design

* There are 3 packages:
    * duck/core: exposes functions for doing deck transforms
        * core function is `renderDeck(html: string; data: Object[]; config: DeckConfig): Buffer[]`
        * also exposes functions for:
            * rendering a project directory
            * parsing config JSON
            * processing CSV with an asset directory

        * supports mustache (html/hbs/handlebars/mu/mustache) and React templating (jsx/tsx)
        * hard requirements:
            * all multi-child containers must be flex
            * no CSS — only inline styles

    * duck/cli: the build tool
        * responsible for taking a project directory and handing it to `duck/core`

    * duck/create-duck-game: the project scaffolder

## TODO

- [X] Move templates to create dir
- [ ] Fix print-n-play PDF generation
- [ ] Add support for stylesheet per deck
- [ ] Add ability to proof
- [ ] Split CLI and core
- [ ] Switch from yaml config to json config with $schema