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


async function fieldDuplicationTest(returnToTestMenu) {

  const query = `{ ${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) { ${config.SUB_FIELD} ${config.SUB_FIELD} } }`;

  try {
    // Example using fetch API for GraphQL request
    const response = await fetch(config.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) throw new Error('Network response was not ok.');

    const result = await response.json();
    const stringResult = JSON.stringify(result);
    console.log(redBold('\nTest failed:'));
    console.log(highlight('API accepted duplicate fields.\n'));
    console.log(yellowBold('API returned:'), `\n${stringResult}\n`);

  } catch (error) {
    console.log(greenBold('\nTest passed:'));
    console.log(highlight('API rejected duplicate fields.\n'));
    console.log('\nSummary of Error');
    console.log('Error: ' + error.message);
  }

  if (returnToTestMenu && typeof returnToTestMenu === 'function') returnToTestMenu();
}


module.exports = { fieldDuplicationTest };