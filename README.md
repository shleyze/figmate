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
- ES6 module `import Figmate from 'figmate'` in your .js file (node environment)
- CommonJS module `const Figmate = require('figmate').default` in your .js file (node environment)
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

**Thease options are required**

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

