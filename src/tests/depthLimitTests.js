const { greenBold, redBold, highlight } = require("../../color");
const config = require("../qevlarConfig.json");
const validateConfig = require("../../__tests__/validateConfig");

const depthLimitTest = {};

// Tests one level deeper than QUERY_DEPTH_LIMIT
depthLimitTest.max = (returnToTestMenu) => {
  validateConfig(config);

  function setDynamicQueryBody() {
    let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {`;
    let depth = 1;
    let endOfQuery = "id}";
    let lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;

    while (depth < config.QUERY_DEPTH_LIMIT) {
      if (lastFieldAddedToQuery == config.TOP_LEVEL_FIELD) {
        dynamicQueryBody += `${config.CIRCULAR_REF_FIELD} {`;
        lastFieldAddedToQuery = config.CIRCULAR_REF_FIELD;
      } else if (lastFieldAddedToQuery == config.CIRCULAR_REF_FIELD) {
        dynamicQueryBody += `${config.TOP_LEVEL_FIELD} {`;
        lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;
      }
      endOfQuery += "}";
      depth += 1;
    }
    return dynamicQueryBody + endOfQuery;
  }
  const dynamicQueryBody = setDynamicQueryBody();

  fetch(config.API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `query depthLimitTestDynamic {
         ${dynamicQueryBody}
       }`,
    }),
  }).then((res) => {
    if (res.status < 200 || res.status > 299) {
      console.log(
        greenBold("Test passed: ") +
          highlight(
            `Query blocked. Query depth exceeded depth limit of ${config.QUERY_DEPTH_LIMIT}.`
          )
      );
      if (returnToTestMenu) returnToTestMenu();
    } else {
      console.log(
        redBold("Test failed: ") +
          highlight(
            `Query depth was over limit of ${config.QUERY_DEPTH_LIMIT}, yet was not blocked.`
          )
      );
      if (returnToTestMenu) returnToTestMenu();
    }
  });
};

// Tests each depth level up to QUERY_DEPTH_LIMIT
depthLimitTest.incremental = async (returnToTestMenu) => {
  validateConfig(config);
  let incrementalDepth = 1;
  let success = true;

  async function makeQueryAtIncrementalDepth() {
    function setDynamicQueryBody() {
      let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {`;
      let depth = 1;
      let endOfQuery = "id}";
      let lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;

      while (depth < incrementalDepth) {
        if (lastFieldAddedToQuery == config.TOP_LEVEL_FIELD) {
          dynamicQueryBody += `${config.CIRCULAR_REF_FIELD} {`;
          lastFieldAddedToQuery = config.CIRCULAR_REF_FIELD;
        } else if (lastFieldAddedToQuery == config.CIRCULAR_REF_FIELD) {
          dynamicQueryBody += `${config.TOP_LEVEL_FIELD} {`;
          lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;
        }
        endOfQuery += "}";
        depth += 1;
      }

      return dynamicQueryBody + endOfQuery;
    }
    const dynamicQueryBody = setDynamicQueryBody();

    return fetch(config.API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `query depthLimitTestDynamic {
           ${dynamicQueryBody}
         }`,
      }),
    }).then((res) => {
      if (res.status < 200 || res.status > 299) success = false;
      return success;
    });
  }

  while (incrementalDepth <= config.QUERY_DEPTH_LIMIT) {
    try {
      success = await makeQueryAtIncrementalDepth();
      if (!success) break;
      incrementalDepth++;
      console.log(
        greenBold(
          `------> Query at depth ${incrementalDepth} complete.<-------`
        )
      );
    } catch (err) {
      success = false;
    }
  }

  if (!success) {
    console.log(
      redBold(
        `------> Query at depth ${incrementalDepth + 1} incomplete.<-------`
      )
    );
    console.log(
      greenBold("Test passed: ") +
        highlight(
          `Query blocked. Depth limited above ${config.QUERY_DEPTH_LIMIT} queries.\n`
        )
    );

    if (returnToTestMenu) returnToTestMenu();
    return;
  } else {
    console.log(
      redBold("Test failed: ") +
        highlight(`Query depth not limited to ${config.QUERY_DEPTH_LIMIT}.\n`)
    );

    if (returnToTestMenu) returnToTestMenu();
  }
};

module.exports = depthLimitTest;
