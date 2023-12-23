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
const configPath = path.resolve(__dirname, '../qevlarConfig.json');
// Read config file
let config = {};
try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  // Set config object
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading config file:', error);
}

const maliciousInjectionTest = {};

maliciousInjectionTest.SQL = (returnToTestMenu) => {
  const potentiallyMaliciousSQL = [
    '1=1',
    `' OR`,
    'select sqlite_version()',
    '@@version',
    'DROP TABLE',
    'UNION SELECT null',
    'SELECT sql FROM sqlite_schema',
    `SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'`
  ];
  /** 
  //TODO: 
  
  Mutation works. data doesn't persist (that's fine). try and find a generic query that
  we can insert all sorts of malicious SQL (and others) into 
  (I think we could iterate through potentially malicious snippets and try a request with each)
  */

  fetch(config.API_URL, {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query {
         ${config.TOP_LEVEL_FIELD}(id: 1) {
          id
         }
       }`
    })
  })
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log('res: ', res));
}

maliciousInjectionTest.noSQL = (returnToTestMenu) => {
  fetch(config.API_URL, {
    method: 'POST',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query {
         ${config.TOP_LEVEL_FIELD}(id: 1) {
          id
         }
       }`
    })
  })
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log('res: ', res));
}

maliciousInjectionTest.XSS = (returnToTestMenu) => {

  //TODO: TURN THIS INTO MALICIOUS INJECTION
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
    .then((res) => console.log('res: ', res));
}

maliciousInjectionTest.OSCommand = (returnToTestMenu) => {

}
maliciousInjectionTest.XSS();
// maliciousInjectionTest.XSS();

module.exports = maliciousInjectionTest;