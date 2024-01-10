const fs = require('fs');
const path = require('path');

const scriptName = 'qevlar';
const scriptCommand = 'node node_modules/qevlar';

const packageJsonPath = path.join('../../', 'package.json');
console.log(packageJsonPath);
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

packageJson.scripts[scriptName] = scriptCommand;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
