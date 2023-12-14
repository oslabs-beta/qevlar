const { GraphQLClient } = require('graphql-request');
const config = require('../qevlarConfig.json');

async function rateLimitTest() {
  const client = new GraphQLClient(config.API_URL);
  const query = `{ ${config.TOP_FIELD} { ${config.SUB_FIELD} } }`;

  try {
    for (let i = 0; i < config.WINDOW; i++) {
      client.request(query);
    }
    console.log(`Test failed: API accepted requests above rate limit (${config.WINDOW}).`);
  } catch (error) {
    console.log(`Test passed: API did not accept requests above rate limit (${config.WINDOW}). Error: ${error.message}`);
  }
}

module.exports = { rateLimitTest };
