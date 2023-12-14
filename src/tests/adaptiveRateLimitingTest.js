const { GraphQLClient } = require('graphql-request');
const config = require('../qevlarConfig.json');
const { greenBold, highlight } = require('../../color');

async function adaptiveRateLimitingTest(callback) {
  const client = new GraphQLClient(config.API_URL);
  const query = `{ ${config.TOP_FIELD} { ${config.SUB_FIELD} } }`;
  let rate = config.INITIAL_RATE;
  let success = true;

  console.log('Starting Adaptive Rate Limiting Test...');
  
  while (success && rate < config.QUERY_LIMIT) {
    console.log(`Testing at rate: ${rate} requests per unit time...`);
    
    try {
      for (let i = 0; i < rate; i++) {
        await client.request(query);
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

  if (callback) callback();
}

module.exports = { adaptiveRateLimitingTest };
