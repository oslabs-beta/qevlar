// Colors library
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


// Get config file
const configPath = path.resolve(__dirname, '../../qevlarConfig.json');
// Read config file
let config = {};
try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  // Set config object
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading config file:', error);
}

const depthLimitTest = {};

//hardcoded query for just for testing
depthLimitTest.devTest = (returnToTestMenu) => {

  fetch(config.API_URL, {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query getCharacters {
         characters {
           name
           houseId
           house {
             name
             charactersInHouse {
               name
               house {
                 name
                 charactersInHouse {
                   name
                   house {
                     name
                     charactersInHouse {
                       name
                       house {
                         name
                       }
                     }
                   }
                 }
               }
             }
           }
         }
       }`
    })
  })
    // .then((res) => res.json())
    // .then((res) => JSON.stringify(res))
    // .then((res) => console.log(res))
    .then((res) => {
      if (res.status < 200 || res.status > 299) {
        console.log(greenBold('Test passed: ') + highlight('Query depth limited above 7 queries.'));
      }
      else console.log(redBold('Test failed: ') + highlight('Query depth not limited below 9.'));
    })
}

//FIXED max query depth (from config value)
depthLimitTest.max = (returnToTestMenu) => {

  //create query body based on depth limit
  function setDynamicQueryBody() {
    let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {`;
    let depth = 1;
    let endOfQuery = 'id}';
    let lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;

    //alternate adding fields that can reference each other
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
  console.log('---> QUERY: ', dynamicQueryBody);

  //make fetch
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
    // .then((res) => res.json())
    // .then((res) => JSON.stringify(res))
    // .then((res) => console.log('RESPONSE--->', res));
    .then((res) => {
      if (res.status < 200 || res.status > 299) { //any non successful response code
        console.log(greenBold('Test passed: ') + highlight(`Query blocked. Query depth exceeded depth limit of ${config.QUERY_DEPTH_LIMIT}.`));
      }
      else {
        console.log(redBold('Test failed: ') + highlight(`Query depth was over limit of ${config.QUERY_DEPTH_LIMIT}, yet was not blocked.`));
      }
    })

}

//INCREMENTS query depth, until blocked
depthLimitTest.incremental = async (returnToTestMenu) => {
  let incrementalDepth = 1;
  let success = false;

  function makeQueryAtIncrementalDepth() {
    //create query body based on incrementalDepth
    function setDynamicQueryBody() {
      let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {`;
      let depth = incrementalDepth;
      let endOfQuery = 'id}';
      let lastFieldAddedToQuery = config.TOP_LEVEL_FIELD;

      //alternate adding fields that can reference each other
      while (depth < config.QUERY_DEPTH_LIMIT - 1) {
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
    console.log('-----> QUERY: ', dynamicQueryBody);

    //make fetch with dynamicQueryBody
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
      // .then((res) => res.json())
      // .then((res) => JSON.stringify(res))
      // .then((res) => console.log(res))
      .then((res) => {
        if (res.status < 200 || res.status > 299) success = false;
        else success = true;
      })
  }

  while (incrementalDepth <= config.QUERY_DEPTH_LIMIT) {
    try {
      await makeQueryAtIncrementalDepth();
      incrementalDepth++;
      console.log(greenBold(`------> Query at depth ${incrementalDepth} complete.<-------`));
    }
    catch (err) {
      success = false;
    }
  }

  if (!success) {
    console.log(greenBold('Test passed: ') + highlight(`Query blocked. Depth limited above ${config.QUERY_DEPTH_LIMIT} queries.`));
    return;
  }
  else {
    console.log(redBold('Test failed: ') + highlight(`Query depth not limited to ${config.QUERY_DEPTH_LIMIT}.`));
  }
}

// depthLimitTest.max();
depthLimitTest.incremental();

module.exports = {
  depthLimitTest,
  getConfig: () => config
}