const axios = require("axios");
const log = require("./log");
const messages = require("./messages");

const BASE_URL = "https://api.figma.com";
const API_VER = "v1";

async function getFile(config) {
  const { token, fileId, boards } = config;

  if (!token) {
    return [new Error(messages.tokenNotFound)];
  }

  if (!fileId) {
    return [new Error(messages.fileIdNotFound)];
  }

  if (!boards.length) {
    throw [new Error(messages.boardsAreEmpty)];
  }

  try {
    log.info(messages.fileLoading);

    const res = await axios.get(`${BASE_URL}/${API_VER}/files/${fileId}`, {
      headers: { "X-Figma-Token": token },
    });

    log.success(messages.fileLoaded);

    return [null, res["data"]];
  } catch (error) {
    const { response: { data: { err } = {} } = {} } = error;
    return [{ message: err || error }];
  }
}

module.exports = { getFile };
