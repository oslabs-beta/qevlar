const config = require('../qevlarConfig.json');
const { greenBold, highlight, green } = require('../../color');

async function adaptiveRateLimitingTest(returnToTestMenu) {
  const query = `{ ${config.TOP_LEVEL_FIELD} { ${config.SUB_FIELD} } }`;
  let rate = config.INITIAL_RATE;
  let success = true;

  console.log('Starting Adaptive Rate Limiting Test...');

  while (success && rate < config.QUERY_RATE_LIMIT) {
    console.log(green('Testing at rate: ') + `${rate} requests per unit time...`);

    try {
      for (let i = 0; i < rate; i++) {
        await sendGraphQLRequest(config.API_URL, query);
      }
      console.log(`Success: API accepted ${rate} requests per unit time.`);
      rate += config.INCREMENT;
    } catch (error) {
      success = false;
      console.log(greenBold('\nTest completed\n'));
      console.log(highlight('Summary of Test Failure:'));
      console.log(`- Failed at rate: ${rate} requests per unit time.`);
      console.log(`- Error Message: ${error.message}`);
      console.log(`- Possible rate limit of the API is just below ${rate} requests per unit time.\n`);
    }
  }

  if (!success) {
    console.log('Consider adjusting the rate limits for better performance or resilience.');
  } else {
    console.log(greenBold('Test concluded: No rate limiting detected within the tested range.'));
  }

  if (returnToTestMenu) returnToTestMenu();
}

async function sendGraphQLRequest(url, query) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

module.exports = { adaptiveRateLimitingTest };
