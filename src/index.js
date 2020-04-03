#!/usr/bin/env node
import {render} from "ink";

import {buildTokensFromDic, cleanUp, getConfig, getFigmaFile, getTokens, log, transformToDictionary} from "./utils";

const isCLIEnv = require.main === module;

async function figmate(config) {
      const CONFIG = await getConfig(config);
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