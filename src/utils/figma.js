const axios = require("axios");
const log = require("./log");
const messages = require("./messages");
const { get: getConfig } = require("./config");

const BASE_URL = "https://api.figma.com";
const API_VER = "v1";

async function getFile(config) {
  const CONFIG = await getConfig(config);
  const { token, fileId } = CONFIG;

  if (!token) {
    throw new Error(messages.tokenNotFound);
  }

  if (!fileId) {
    throw new Error(messages.fileIdNotFound);
  }

  try {
    log.info(messages.fileLoading);

    const res = await axios.get(`${BASE_URL}/${API_VER}/files/${fileId}`, {
      headers: { "X-Figma-Token": token },
    });

    log.success(messages.fileLoaded);

    return res["data"];
  } catch (error) {
    const { response: { data: { err } = {} } = {} } = error;

    throw new Error(err || error);
  }
}

module.exports = { getFile };
