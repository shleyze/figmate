import fs from "fs";
import path from "path";

export const isFileExist = path => fs.existsSync(path);

export const loadFile = path =>
  new Promise(resolve => {
    if (!path) {
      throw new Error("Path is empty!");
    }
    if (!fs.existsSync(path)) {
      throw new Error("File doesn't exist");
    }

    fs.readFile(path, "utf8", (error, data) => {
      if (error) throw new Error(error);
      resolve(JSON.parse(data));
    });
  });

export async function createFolder(dir) {
  if (!dir) return Promise.reject("Dir is required");

  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, error => {
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
      fs.writeFile(filePath, file, "utf-8", error => {
        if (error) throw new Error(`${error}`);

        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function writeFile(file, filePath) {
  if (!file || !filePath) {
    return Promise.reject("File, path, name are required!");
  }

  await createFolder(path.parse(filePath).dir);
  return await write(file, filePath);
}
