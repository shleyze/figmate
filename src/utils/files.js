const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const messages = require("./messages");

const isFileExist = (filePath) => fs.existsSync(filePath);

async function loadFile(filePath) {
  if (!filePath) {
    return [new Error(messages.pathIsEmpty)];
  }
  if (!isFileExist(filePath)) {
    return [new Error(messages.fileNotFound)];
  }

  return new Promise((resolve) => {
    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        return resolve([error]);
      }

      resolve([null, JSON.parse(data)]);
    });
  });
}

async function createFolder(dir) {
  if (!dir) return Promise.reject("Dir is required");

  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, (error) => {
          if (error) throw error;
          resolve(true);
        });
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

async function write(file, filePath) {
  return await new Promise((resolve, reject) => {
    try {
      fs.writeFile(filePath, file, "utf-8", (error) => {
        if (error) throw error;

        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function writeFile(file, filePath) {
  if (!file || !filePath) {
    return Promise.reject("File, path, name are required!");
  }

  await createFolder(path.parse(filePath).dir);
  return await write(file, filePath);
}

async function deleteFolder(folderPath) {
  return new Promise((resolve) => {
    rimraf(folderPath, (error) => {
      if (error) throw new Error(`${error}`);
      resolve();
    });
  });
}

module.exports = { isFileExist, loadFile, writeFile, deleteFolder };
