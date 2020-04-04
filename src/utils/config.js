const path = require("path");
const dotenv = require("dotenv");
const merge = require("lodash/merge");

const { loadFile } = require("./files");
const { name: PACKAGE_NAME } = require("../../package");

async function get(config) {
  const USER_ROOT = process.cwd();
  const CONFIG_PATH = `${USER_ROOT}/${PACKAGE_NAME}.config.json`;
  const PACKAGE_CONFIG_PATH = `${USER_ROOT}/package.json`;
  const { parsed: ENV_CONFIG } = dotenv.config();
  const [, USER_CONFIG = {}] = await loadFile(CONFIG_PATH);
  const [, USER_PACKAGE_CONFIG = {}] = await loadFile(PACKAGE_CONFIG_PATH);

  const DEFAULT_CONFIG = {
    token: (ENV_CONFIG && ENV_CONFIG.FIGMA_TOKEN) || null,
    fileId: (ENV_CONFIG && ENV_CONFIG.FIGMA_FILE_ID) || null,
    tempFolder: path.join(path.resolve(__dirname, "../../"), "temp"),
    boards: [],
    platforms: {},
  };

  return merge(
    DEFAULT_CONFIG,
    USER_PACKAGE_CONFIG[PACKAGE_NAME],
    USER_CONFIG,
    config
  );
}

module.exports = { get };
