#!/usr/bin/env node
const figmaApi = require("./utils/figma");
const dic = require("./utils/dic");

const isCLI = require.main === module;

async function figmate(moduleConfig) {
  let FILE;

  try {
    FILE = await figmaApi.getFile(moduleConfig);
  } catch (e) {
    throw new Error(e);
  }

  try {
    await dic.buildTokens(FILE, moduleConfig);
  } catch (e) {
    throw new Error(e);
  }
}

if (isCLI) {
  figmate();
}

module.exports = figmate;
module.exports.getFigmaFile = figmaApi.getFile;
module.exports.buildTokens = dic.buildTokens;
