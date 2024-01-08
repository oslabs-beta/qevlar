const { redBold, highlight } = require("../color");

function validateConfig(config) {
  const expectedTypes = {
    ANY_TOP_LEVEL_FIELD_ID: "number",
    API_URL: "string",
    BATCH_SIZE: "number",
    CIRCULAR_REF_FIELD: "string",
    INCREMENT: "number",
    INITIAL_RATE: "number",
    NO_SQL: "boolean",
    QUERY_DEPTH_LIMIT: "number",
    QUERY_RATE_LIMIT: "number",
    SQL: "boolean",
    SQL_COLUMN_NAME: "string",
    SQL_TABLE_NAME: "string",
    SUB_FIELD: "string",
    TIME_WINDOW: "number",
    TOP_LEVEL_FIELD: "string",
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
