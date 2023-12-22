const { GraphQLClient } = require('graphql-request');
const { greenBold, highlight, redBold } = require('../../color');
const config = require('../qevlarConfig.json');

async function rateLimitTest(returnToTestMenu) {
  const client = new GraphQLClient(config.API_URL);
  const query = `{ ${config.TOP_LEVEL_FIELD} { ${config.SUB_FIELD} } }`;

  let reqs = 0;
  let lastReqTime = Date.now();

  const makeRequest = async () => {
    reqs += 1;
    try {
      await client.request(query);
      console.log(
        `Test failed: API accepted requests above rate limit (${config.INITIAL_RATE}).`
      );
    } catch (error) {
      console.log(
        `Test passed: API did not accept requests above rate limit (${config.INITIAL_RATE}). Error: ${error.message}`
      );
    }
  };

  const now = Date.now();

  if (now - lastReqTime < config.TIME_PASSED) {
    console.log(greenBold('Test passed: ') + highlight('Requests made within time window.'));
  } else {
    reqs = 0;
    lastReqTime = now;
    console.log(redBold('Test failed: ') + highlight('Time window elapsed. Resetting request count.'));
    makeRequest();
  }

  if (returnToTestMenu) returnToTestMenu();
}

module.exports = rateLimitTest;
