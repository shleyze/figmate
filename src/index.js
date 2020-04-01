#!/usr/bin/env babel-node
import { render } from "ink";

import {
  getConfig,
  getFigmaFile,
  getTokens,
  transformToDictionary,
  buildTokensFromDic,
  cleanUp,
  log
} from "./utils";

const isCLIEnv = require.main === module;

async function figmate() {
      const CONFIG = await getConfig();
  const FILE = await getFigmaFile(CONFIG);
  const RAW_TOKENS = getTokens(FILE, CONFIG);
  const logTokens = render(log.tokens(RAW_TOKENS));

  logTokens.unmount();
  await logTokens.waitUntilExit();
  const DIC_TOKENS = transformToDictionary(RAW_TOKENS);
  await buildTokensFromDic(DIC_TOKENS, CONFIG);

  await cleanUp(CONFIG);
}

if (isCLIEnv) {
  figmate().catch(error => render(log.error(error)))
}

export default figmate