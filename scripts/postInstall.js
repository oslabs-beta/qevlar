const fs = require('fs');
const path = require('path');

const scriptName = 'qevlar';
const scriptCommand = 'node node_modules/qevlar/scripts/qevlar';

const packageJsonPath = '../../../package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

packageJson.scripts[scriptName] = scriptCommand;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
