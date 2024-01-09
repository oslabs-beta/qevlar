const fs = require('fs');
const path = require('path');

const scriptName = 'test';
const scriptCommand = 'node node_modules/qevlar/scripts/qevlar';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

packageJson.scripts[scriptName] = scriptCommand;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
