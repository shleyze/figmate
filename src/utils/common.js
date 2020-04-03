import dotenv from "dotenv";
import path from "path";
import rimraf from "rimraf";
import merge from "lodash/merge";
import * as Figma from "figma-api";
import {render} from "ink";

import {isFileExist, loadFile, log, messages, writeFile} from "./index";

const PACKAGE_NAME = "figmate";

export async function getConfig(FUNC_CONFIG) {
  const USER_ROOT = process.cwd();
  const CONFIG_PATH = `${USER_ROOT}/${PACKAGE_NAME}.config.json`;
  const PACKAGE_CONFIG_PATH = `${USER_ROOT}/package.json`;
  const { parsed: ENV_CONFIG } = dotenv.config();
  const USER_CONFIG = await loadFile(CONFIG_PATH).catch(() => {});
  const USER_PACKAGE_CONFIG = await loadFile(
    PACKAGE_CONFIG_PATH
  ).catch(() => {});

  const DEFAULT_CONFIG = {
    token: (ENV_CONFIG && ENV_CONFIG.FIGMA_TOKEN) || null,
    fileId: (ENV_CONFIG && ENV_CONFIG.FIGMA_FILE_ID) || null,
    tempFolder: path.join(path.resolve(__dirname, "../../"), "temp"),
    boards: [],
    platforms: {}
  };

  return merge(DEFAULT_CONFIG, USER_PACKAGE_CONFIG[PACKAGE_NAME], USER_CONFIG, FUNC_CONFIG);
}

export async function getFigmaFile(config) {
  const { tempFolder, boards } = config;

  const FIGMA_TEMP_FILE = `${tempFolder}/figma.json`;

  if (isFileExist(FIGMA_TEMP_FILE)) {
    return await loadFile(FIGMA_TEMP_FILE);
  }

  const { token, fileId } = config;

  if (!token) {
    throw new Error(messages.tokenNotFound);
  }

  if (!fileId) {
    throw new Error(messages.fileIdNotFound);
  }

  if (!boards.length) {
    throw new Error(messages.boardsAreEmpty);
  }

  const FigmaAPI = new Figma.Api({ personalAccessToken: token });

  const loading = render(log.loading());
  const FILE = await FigmaAPI.getFile(fileId).catch(
    ({ response: { data } }) => {
      throw new Error(data.err);
    }
  );

  await writeFile(JSON.stringify(FILE, null, 2), FIGMA_TEMP_FILE);
  loading.rerender(log.loaded());
  loading.unmount();
  await loading.waitUntilExit();

  return FILE;
}

export const transformToDictionary = arr => {
  return arr.reduce((acc, item) => {
    item.forEach(({ name, description, styles = {} }) => {
      const path = name.split("/");
      const obj = {};
      path.reduce((acc, item, index, src) => {
        const isLast = src.length - 1 === index;

        if (isLast) {
          acc[item] = Object.entries(styles).reduce((acc, [key, value]) => {
            acc[key] = {
              value,
              ...(description && { comment: description })
            };
            return acc;
          }, {});
        } else {
          acc[item] = {};
        }

        return acc[item];
      }, obj);

      acc = merge(acc, obj);
    });

    return acc;
  }, {});
};

export async function cleanUp(config) {
  return new Promise(resolve => {
    const { tempFolder } = config;
    rimraf(tempFolder, error => {
      if (error) throw new Error(`${error}`);
      resolve();
    });
  });
}
