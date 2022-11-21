/* eslint-disable */
const fs = require('fs');
const path = require('path');
const generatePackages = require('./generators/package.generator');

async function serviceGeneration(data, resolve, reject) {
  const { serviceName } = data;
  const serviceFolderPath = path.join(__dirname, '../services', serviceName);
  // wait for folder creation to finish then launch package generation
  return fs.mkdir(serviceFolderPath, async (err) => {
    if (err) {
      console.log(error);
      reject(err);
    } else {
      try {
        await Promise.all([generatePackages(serviceFolderPath, data, resolve, reject)]);
        resolve();
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    }
  });
}

module.exports = { serviceGeneration };
