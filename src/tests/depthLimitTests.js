const { green, greenBold, greenItalic,
  greenHighlight, greenUnderlined, greenOut,
  red, redBold, redItalic,
  redHighlight, redUnderlined,
  redOut, dark, darkBold,
  darkItalic, darkHighlight,
  darkUnderlined, darkOut, yellow,
  yellowBold, yellowItalic, yellowHighlight,
  yellowUnderlined, yellowOut,
  bold, italic, highlight,
  underlined, whiteOut } = require('../../color');
const fs = require('fs');
const path = require('path');


//Get config file
const configPath = path.resolve(__dirname, '../qevlarConfig.json');
//Read config file
let config = {};
try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  //Set config object
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading config file:', error);
}

const depthLimitTest = {};

//Fixed max query depth test
depthLimitTest.max = (returnToTestMenu) => {

  //Create query body based on depth limit
  function setDynamicQueryBody() {
    let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {`;
    let depth = 1;
    let endOfQuery = 'id}';
    let lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;

    //Alternate adding fields that can reference each other
    while (depth < config.QUERY_DEPTH_LIMIT) {
      if (lastFieldAddedToQuery == config.TOP_LEVEL_FIELD) {
        dynamicQueryBody += `${config.CIRCULAR_REF_FIELD} {`;
        lastFieldAddedToQuery = config.CIRCULAR_REF_FIELD;
      }
      else if (lastFieldAddedToQuery == config.CIRCULAR_REF_FIELD) {
        dynamicQueryBody += `${config.TOP_LEVEL_FIELD} {`;
        lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;
      }
      endOfQuery += '}';
      depth += 1;
    }
    return dynamicQueryBody + endOfQuery;
  }
  const dynamicQueryBody = setDynamicQueryBody();

  //Make fetch
  fetch(config.API_URL, {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query depthLimitTestDynamic {
         ${dynamicQueryBody}
       }`
    })
  })
    .then((res) => {
      if (res.status < 200 || res.status > 299) { //any non successful response code
        console.log(greenBold('Test passed: ') + highlight(`Query blocked. Query depth exceeded depth limit of ${config.QUERY_DEPTH_LIMIT}.`));
        if (returnToTestMenu) returnToTestMenu();
      }
      else {
        console.log(redBold('Test failed: ') + highlight(`Query depth was over limit of ${config.QUERY_DEPTH_LIMIT}, yet was not blocked.`));
        if (returnToTestMenu) returnToTestMenu();
      }
    })

}

//Increments query depth until blocked
depthLimitTest.incremental = async (returnToTestMenu) => {
  let incrementalDepth = 1;
  let success = true;

  async function makeQueryAtIncrementalDepth() {
    //Create query body based on incrementalDepth
    function setDynamicQueryBody() {
      let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {`;
      let depth = 1;
      let endOfQuery = 'id}';
      let lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;

      //Alternate adding fields that can reference each other 
      while (depth < incrementalDepth) { //Until reaching depth 1 greater than limit
        if (lastFieldAddedToQuery == config.TOP_LEVEL_FIELD) {
          dynamicQueryBody += `${config.CIRCULAR_REF_FIELD} {`;
          lastFieldAddedToQuery = config.CIRCULAR_REF_FIELD;
        }
        else if (lastFieldAddedToQuery == config.CIRCULAR_REF_FIELD) {
          dynamicQueryBody += `${config.TOP_LEVEL_FIELD} {`;
          lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;
        }
        endOfQuery += '}';
        depth += 1;
      }
      return dynamicQueryBody + endOfQuery;
    }
    const dynamicQueryBody = setDynamicQueryBody();

    //Make fetch with dynamicQueryBody
    return fetch(config.API_URL, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: `query depthLimitTestDynamic {
           ${dynamicQueryBody}
         }`
      })
    })
      .then((res) => {
        if (res.status < 200 || res.status > 299) success = false;
        return success;
      })
  }

  while (incrementalDepth <= config.QUERY_DEPTH_LIMIT) {
    try {
      success = await makeQueryAtIncrementalDepth();
      if (!success) break;
      incrementalDepth++;
      console.log(greenBold(`------> Query at depth ${incrementalDepth} complete.<-------`));
    }
    catch (err) {
      success = false;
    }
  }

  if (!success) {
    console.log(redBold(`------> Query at depth ${incrementalDepth + 1} incomplete.<-------`));
    console.log(greenBold('Test passed: ') + highlight(`Query blocked. Depth limited above ${config.QUERY_DEPTH_LIMIT} queries.\n`));
    if (returnToTestMenu) returnToTestMenu();
    return;
  }
  else {
    console.log(redBold('Test failed: ') + highlight(`Query depth not limited to ${config.QUERY_DEPTH_LIMIT}.\n`));
    if (returnToTestMenu) returnToTestMenu();
  }
}

module.exports = depthLimitTest;