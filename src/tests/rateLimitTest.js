const { GraphQLClient } = require('graphql-request');
const config = require('../qevlarConfig.json');

async function rateLimitTest(returnToTestMenu) {
  const client = new GraphQLClient(config.API_URL);
  const query = `{ ${config.TOP_FIELD} { ${config.SUB_FIELD} } }`;

  let reqs = 0;
  let lastReqTime = Date.now();

  const makeRequest = async () => {
    reqs += 1;
    try {
      await client.request(query);
      console.log(
        `Test failed: API accepted requests above rate limit (${config.WINDOW}).`
      );
    } catch (error) {
      console.log(
        `Test passed: API did not accept requests above rate limit (${config.WINDOW}). Error: ${error.message}`
      );
    }
  };

  const now = Date.now();

  if (now - lastReqTime < config.TIME_PASSED) {
    makeRequest();
  } else {
    reqs = 0;
    lastReqTime = now;
    makeRequest();
  }

  if (returnToTestMenu) returnToTestMenu();
}

module.exports = { rateLimitTest };
