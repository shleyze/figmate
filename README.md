# Figmate

Enhance your styleguide with design tokens. For Figma lovers <3

It's Alpha version for now.

## Installation

The package works with  [node.js](https://nodejs.org/), so be sure that you installed latest version.

You can install in two ways:

**Global (preferred way)** run `npm install -g figmate`

**Local** run `npm install figmate --save` or `npm install figmate --save-dev`

## How to use

- CLI run `figmate` in terminal
- CommonJS module `const Figmate = require('figmate')` in your .js file
## How to configure

All files should be placed your project root folder:

- in package.json
```
{
  "name": "yourproject",
  ...
  
  "figmate": {
    // configuration
  }
  ...
}
```

- in figmate.config.json
```
{
  // configuration
}
```

- pass as argument when call Figmate module
```
import Figmate from 'figmate' // Async function

Figmate({
  // configuration
})
```

## Configuration

### Token and File id (:string)

**Tease options are required**

[Token](https://www.figma.com/developers/api#access-tokens) and file id can be placed in .env file with keys: 

```
FIGMA_TOKEN = 37-dab #example
FIGMA_FILE_ID = rD3v #example
```
If you don't have .env you can pass options as other options

### Boards(:array of object)

You can choose any boards and any type of design tokens that you need to be parsed

```
boards: [
  ...
  {
    path: "Token/Fonts",
    type: "style/text"
  },
  ...
]
```

As a path you can specify the page or group and it's possible to be nested as you need by divider `/` 

| Type         | Description                                             |
|--------------|---------------------------------------------------------|
| style/text   | Text styles                                             |
| style/fill   | Color styles                                            |
| style/shadow | Box-shadow styles                                       |
| space        | Spacer or indents, name and height are taken from shape |
| radius       | Border-radius, name and radius are taken from shape     |

### Platforms(:object)

Figmate is using [Style dictionary](https://amzn.github.io/style-dictionary/#/config) package to generate files

```
platforms: {
  ...
}
```

## Utils

Tease utils helps if you have themes in one file and you don't want to request the same file for every theme 

### getFigmaFile(:configuration object)

`const { getFigmaFile } = require('figmate')`

Async function to get Figma file and then parse it as you need. You can provide config as first argument.


### buildTokens(:figmaFile JSON, :configuration object)

`const { buildTokens } = require('figmate')`

Async function to parse Figma file. You need to provide file as first argument and config as second.

### Example to use utils

```
const { getFigmaFile, buildTokens } = require('figmate')

const themes = ['alpha', 'betta', 'gamma']

async function generateTokens(file) {
  for (const theme of themes) {
    await buildTokens(file, {
      boards: [
        {
          path: `Tokens/${theme}`,
          type: 'style/text',
        },
      ],
      platforms: {
        scss: {
          transformGroup: 'scss',
          buildPath: `${theme}/`,
          files: [
            {
              destination: `${theme}_tokens.scss`,
              format: 'scss/variables',
            },
          ],
        },
      },
    })
  }
}

getFigmaFile().then(generateTokens)
```

