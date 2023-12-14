const { GraphQLClient } = require('graphql-request');
const config = require('../qevlarConfig.json')

const { green, greenBold, greenItalic,
  greenHighlight, greenUnderlined, greenOut,
  red, redBold, redItalic,
  redHighlight, redUnderlined,
  redOut, dark, darkBold,
  darkItalic, darkHighlight,
  darkUnderlined, darkOut, yellow,
  yellowBold, yellowItalic, yellowHighlight,
  yellowUnderlined, yellowOut,
  bold, italic, highlight,
  underlined, whiteOut } = require('../../color');

async function fieldDuplicationTest(callback) {
  const client = new GraphQLClient(config.API_URL);
  const query = `{ ${config.TOP_FIELD} { ${config.SUB_FIELD} ${config.SUB_FIELD} } }`;

  try {
    await client.request(query);
    console.log(redBold('\nTest failed:'));
    console.log(highlight('API accepted duplicate fields.'));
  } catch (error) {
    console.log(greenBold('\nTest passed:'));
    console.log('API rejected duplicate fields.');
    console.log(highlight('\nSummary of Error'))
    console.log(('Error: ' + error.message));
  }11

  if (callback) callback();
}

module.exports = { fieldDuplicationTest };
