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

//hardcoded query for testing
depthLimitTest.devTest = () => {

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
depthLimitTest.max = () => {

  //create query body based on depth limit
  function setDynamicQueryBody() {
    let dynamicQueryBody = `${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {${config.CIRCULAR_REF_FIELD} {`;
    let depth = config.QUERY_DEPTH_LIMIT - 1;
    let endOfQuery = 'id}}';
    while (depth > 0) {
      dynamicQueryBody += `${config.TOP_LEVEL_FIELD} {${config.CIRCULAR_REF_FIELD} {`; //field and subfield from config
      endOfQuery += '}}';
      depth--;
    }
    return dynamicQueryBody + endOfQuery;
  }
  const dynamicQueryBody = setDynamicQueryBody();

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
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log(res))
  // .then((res) => {
  //   if (res.status < 200 || res.status > 299) {
  //     console.log(greenBold('Test passed: ') + highlight(`Query depth limited above ${config.QUERY_DEPTH_LIMIT} queries.`));
  //   }
  //   else console.log(redBold('Test failed: ') + highlight(`Query depth not limited below ${config.QUERY_DEPTH_LIMIT}.`));
  // })

}

depthLimitTest.incremental = () => {
  //create query body based on depth limit
  function setDynamicQueryBody() {
    let dynamicQueryBody = '';
    let depth = config.QUERY_DEPTH_LIMIT;
    let endOfQuery = 'id';
    while (depth > 0) {
      dynamicQueryBody += `${config.TOP_FIELD} {${config.SUB_FIELD} {`; //field and subfield from config
      endOfQuery += '}}';
      depth--;
    }
    return dynamicQueryBody + endOfQuery;
  }
  const dynamicQueryBody = setDynamicQueryBody();
  console.log('QUERY ----->', dynamicQueryBody);

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
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log(res))
  // .then((res) => {
  //   if (res.status < 200 || res.status > 299) {
  //     console.log(greenBold('Test passed: ') + highlight(`Query depth limited above ${config.QUERY_DEPTH_LIMIT} queries.`));
  //   }
  //   else console.log(redBold('Test failed: ') + highlight(`Query depth not limited below ${config.QUERY_DEPTH_LIMIT}.`));
  // })

}

// depthLimitTest.max();

module.exports = {
  depthLimitTest,
  getConfig: () => config
}