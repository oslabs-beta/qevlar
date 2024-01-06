const { redBold, highlight, greenBold } = require("../../color");

// validates types in config file
function validateConfig(config) {
  const expectedTypes = {
    API_URL: "string",
    TOP_LEVEL_FIELD: "string",
    SUB_FIELD: "string",
    ANY_TOP_LEVEL_FIELD_ID: "number",
    CIRCULAR_REF_FIELD: "string",
    QUERY_RATE_LIMIT: "number",
    WINDOW: "number",
    QUERY_DEPTH_LIMIT: "number",
    NoSQL: "boolean",
    SQL: "boolean",
    SQL_TABLE_NAME: "string",
    SQL_COLUMN_NAME: "string",
    INITIAL_RATE: "number",
    INCREMENT: "number",
    BATCH_SIZE: "number",
    TIME_PASSED: "number",
  };

  const keys = Object.keys(expectedTypes);

  for (const key of keys) {
    if (typeof config[key] !== expectedTypes[key]) {
      console.error(
        highlight(
          redBold(
            `\nERROR: INVALID TYPE FOR ${key}\nPlease adjust your qevlarConfig.json to properly account for the correct data types.\nExpected ${
              expectedTypes[key]
            }, but got ${typeof config[key]}\n`
          )
        )
      );
      return false;
    }
  }
  return true;
}

module.exports = validateConfig;
