/* eslint-disable */
const fs = require('fs');
const { exec, execSync } = require('child_process');
const { series } = require('async');
const packageTemplatePath = 'automation/templates/package.hbs';
const { compile } = require('handlebars');

const dbVersions = {
  mongodb: '4.11.0',
  mysql: '2.18.1',
};

async function generatePackages(serviceFolderPath, data, resolve, reject) {
  const { database, serviceName, setupTest } = data;
  const packagePath = `${serviceFolderPath}/package.json`;
  const packageTemplate = fs.readFileSync(packageTemplatePath, 'utf8');
  const template = compile(packageTemplate);
  const newPackage = template({ serviceName, database, setupTest, databaseVersion: dbVersions[database] });
  // Format and write package.json
  const formattedPackage = JSON.stringify(JSON.parse(newPackage), null, 2);
  fs.writeFile(packagePath, formattedPackage, (err) => {
    if (err) throw reject(err);

    execSync('yarn', { stdio: 'inherit', cwd: `${serviceFolderPath}` }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      console.log('Dependencies installed');
      resolve();
    });
  });
}

module.exports = generatePackages;
