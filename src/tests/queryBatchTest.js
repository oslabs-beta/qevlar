const config = require('../../qevlarConfig.json');
const { greenBold, redBold, highlight, yellowBold } = require('../../color');
const validateConfig = require('../../__tests__/validateConfig');

const generateDynamicBatchQuery = (count, baseQuery) => {
  return Array(count).fill(baseQuery);
};

const sendBatchQueries = async (url, batchedQueries) => {
  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(batchedQueries),
    });
    const end = Date.now();
    const latency = end - start;
    return { status: response.status, latency, error: null };
  } catch (error) {
    const end = Date.now();
    const latency = end - start;
    return { status: 'error', latency, error: error.message };
  }
};

const calculateThroughput = (numBatches, batchLength, elapsedTime) => {
  return (numBatches * batchLength) / (elapsedTime / 1000);
};

const calculateStatistics = (times) => {
  const sorted = [...times].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const average = sum / sorted.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const percentile = (percent) => sorted[Math.floor(sorted.length * percent)];

  return {
    min,
    max,
    average,
    median,
    percentile97: percentile(0.97),
  };
};

const logResults = (
  responseTimes,
  testPassedCount,
  testFailedCount,
  errors,
  numBatches,
  batchLength,
  elapsedTime
) => {
  const stats = calculateStatistics(responseTimes);

  console.log(
    yellowBold(`\nThroughput: `) +
      highlight(
        `${calculateThroughput(numBatches, batchLength, elapsedTime).toFixed(
          2
        )} batches/second`
      )
  );

  console.log(yellowBold(`Response Time Statistics:`));
  console.log(
    `Min: ${stats.min} ms, Max: ${
      stats.max
    } ms, Average: ${stats.average.toFixed(2)} ms, Median: ${
      stats.median
    } ms, 97th Percentile: ${stats.percentile97} ms`
  );

  console.log(yellowBold(`Summary:`));
  console.log(
    highlight(`Total Batches: ${numBatches}`),
    highlight(`Passed: ${testPassedCount}`),
    highlight(`Failed: ${testFailedCount}`)
  );

  if (errors.length > 0) {
    console.log(
      redBold(`Errors encountered:`),
      errors.map((err) => highlight(`\n${err}`)).join('')
    );
  }
};

const batchTest = async (
  returnToTestMenu,
  numBatches = 100,
  batchLength = 10
) => {
  const url = process.env.API_URL || config.API_URL;
  const topLevelField = process.env.TOP_LEVEL_FIELD || config.TOP_LEVEL_FIELD;
  const anyTopLevelFieldId =
    process.env.ANY_TOP_LEVEL_FIELD_ID || config.ANY_TOP_LEVEL_FIELD_ID;
  const subField = process.env.SUB_FIELD || config.SUB_FIELD;

  validateConfig(config);

  const query = `{ ${topLevelField}(id: "${anyTopLevelFieldId}") { ${subField} ${subField} } }`;
  const newBatch = generateDynamicBatchQuery(batchLength, query);

  const start = Date.now();
  const responseTimes = [];
  const errors = [];
  let testPassedCount = 0;
  let testFailedCount = 0;

  for (let i = 0; i < numBatches; i++) {
    const batchedQueries = newBatch.map((query) => ({ query }));
    const { status, latency, error } = await sendBatchQueries(
      url,
      batchedQueries
    );

    if (latency !== null) responseTimes.push(latency);

    if (status === 200) {
      console.error(
        redBold('Test Failed: ') +
          highlight(`Batch query test failed with status: ${status}`)
      );
      testFailedCount++;
    } else {
      console.log(
        greenBold('Test Passed: ') + highlight('Server rejected batch query')
      );
      testPassedCount++;
    }

    if (error) {
      errors.push(`Batch ${i + 1}: ${error}`);
    }
  }

  const end = Date.now();
  const elapsedTime = end - start;

  logResults(
    responseTimes,
    testPassedCount,
    testFailedCount,
    errors,
    numBatches,
    batchLength,
    elapsedTime
  );

  if (returnToTestMenu) returnToTestMenu();
};

module.exports = { batchTest, generateDynamicBatchQuery };
