/* eslint-disable */
const fs = require('fs');
const readline = require('readline');

async function editFile(path, predicate, item) {
  const tmpPath = 'tmp-file.txt';
  try {
    await fs.copyFileSync(path, tmpPath);
    const tmpFile = await fs.readFileSync(tmpPath, 'utf8').split('\n');

    const fileStream = fs.createReadStream(tmpPath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;
      if (line.includes(predicate)) {
        break;
      }
    }
    tmpFile.splice(lineNumber, 0, item);
    const data = tmpFile.join('\n');
    await fs.writeFileSync(path, data);
    await fs.unlinkSync(tmpPath);
  } catch (error) {
    throw error;
  }
}

async function copyFile(path, destPath) {
  return fs.copyFileSync(path, destPath);
}

async function createFolder(path) {
  return fs.mkdirSync(path);
}

async function createFile(path, data) {
  return fs.writeFileSync(path, data);
}

async function getLastFolder(path, withFileTypes = false) {
  try {
    const folders = await fs.promises.readdir(path, { withFileTypes });
    return folders.slice(-1).pop();
  } catch (error) {
    throw error;
  }
}

async function getFile(path, encoding = 'utf-8') {
  return fs.readFileSync(path, encoding);
}
module.exports = { editFile, copyFile, getLastFolder, getFile, createFile, createFolder };
