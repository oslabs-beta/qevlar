const config = require('../qevlarConfig.json');
const { greenBold, redBold, highlight, yellowBold } = require('../../color');
const validateConfig = require('../../__tests__/validateConfig');

const batchTest = async (returnToTestMenu) => {
  const url = config.API_URL;
  const batchLength = config.BATCH_SIZE;
  const numBatches = 100; // Number of batches to send for testing

  const query = `{ ${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) { ${config.SUB_FIELD} ${config.SUB_FIELD} } }`;

  validateConfig(config);

  const generateDynamicBatchQuery = (count, baseQuery) => {
    const batchQueries = [];

    for (let i = 1; i <= count; i++) {
      batchQueries.push(baseQuery);
    }

    return batchQueries;
  };

  const newBatch = generateDynamicBatchQuery(batchLength, query);

  const start = Date.now();
  const responseTimes = [];

  // Send multiple batches of batch queries
  for (let i = 0; i < numBatches; i++) {
    const batchedQueries = newBatch.map((query) => ({ query }));

    const batchStartTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(batchedQueries),
    });

    const batchEndTime = Date.now();
    const latency = batchEndTime - batchStartTime;
    responseTimes.push(latency);

    if (response.status === 200) {
      console.error(
        redBold('Test Failed: ') +
          highlight(`Batch query test failed with status: ${response.status}`)
      );
    } else {
      console.log(
        greenBold('Test Passed: ') + highlight('Server rejected batch query')
      );
    }
  }

  // Calculate throughput
  const end = Date.now();
  const elapsedTime = end - start;
  const throughput = (numBatches * batchLength) / (elapsedTime / 1000); // Batches per second
  console.log(
    yellowBold(`Throughput: `) +
      highlight(` ${throughput.toFixed(2)} batches/second`)
  );

  // Sort response times to calculate high percentile latency
  responseTimes.sort((a, b) => a - b);
  const ninetyFifthPercentile =
    responseTimes[Math.floor(responseTimes.length * 0.95)];
  console.log(
    yellowBold(`95th Percentile Latency: `) +
      highlight(`${ninetyFifthPercentile} milliseconds`)
  );

  // Call returnToTestMenu if provided
  if (returnToTestMenu) returnToTestMenu();
};

module.exports = batchTest;
