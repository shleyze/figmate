#!/usr/bin/env node
const log = require("./utils/log");
const config = require("./utils/config");
const figmaApi = require("./utils/figma");
const tokens = require("./utils/tokens");
const dic = require("./utils/dic");
const files = require("./utils/files");

const isCLI = require.main === module;

async function figmate(moduleConfig) {
  let ERR, FILE;

  const CONFIG = await config.get(moduleConfig);

  [ERR, FILE] = await figmaApi.getFile(CONFIG);

  if (ERR) {
    log.error(ERR["message"]);
    return [ERR];
  }

  const RAW_TOKENS = tokens.get(FILE, CONFIG);
  const DIC_TOKENS = dic.transform(RAW_TOKENS);
  [ERR] = await dic.buildTokens(DIC_TOKENS, CONFIG);

  if (ERR) {
    log.error(ERR["message"]);
    return [ERR];
  }

  return await files.deleteFolder(CONFIG["tempFolder"]);
}

if (isCLI) {
  figmate();
}

module.exports = figmate;
