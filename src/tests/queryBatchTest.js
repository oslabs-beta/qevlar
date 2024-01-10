const config = require("../../qevlarConfig.json");
const validateConfig = require("../../__tests__/validateConfig");

const batchTest = (returnToTestMenu) => {
  const url = config.API_URL;
  const batchLength = config.BATCH_SIZE;

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

  const batchedQueries = newBatch.map((query) => ({ query }));

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(batchedQueries),
  })
    .then((res) => {
      console.log("res", res);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("batch res", data);
    })
    .catch((error) => {
      console.error("error encountered: ", error);
    });

  if (returnToTestMenu) returnToTestMenu();
};

module.exports = batchTest;
