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
  config = JSON.parse(configFile)
} catch (error) {
  console.error('Error reading config file:', error);
}

const maliciousInjectionTest = {};

maliciousInjectionTest.SQL = async (returnToTestMenu) => {

  if (!config.SQL) {
    console.log('SQL config variable must be set to boolean true to execute SQL injection test.')
    return;
  }

  let successfulQuery = true;
  const blockedInjections = [];
  const allowedInjections = [];

  const potentiallyMaliciousSQL = [
    'Block me!"',//purposefully blocked, added double quote
    '1=1',
    `' OR`,
    'select sqlite_version()',
    '@@version',
    'DROP TABLE',
    'UNION SELECT null',
    'SELECT sql FROM sqlite_schema',
    `SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'`,
    'OR 1=0',
    'OR x=x',
    'OR x=y',
    'OR 1=1#',
    'OR 1=0#',
    'OR x=x#',
    'OR x=y#',
    'OR 1=1-- ',
    'OR 1=0-- ',
    'OR x=x-- ',
    'OR x=y--',
    'HAVING 1=1',
    'HAVING 1=0',
    'HAVING 1=1#',
    'HAVING 1=0#',
    'HAVING 1=1--',
    'HAVING 1=0--',
    'AND 1=1',
    'AND 1=0',
    'AND 1=1--',
    'AND 1=0--',
    'AND 1=1#',
    'AND 1=0#',
    "AND 1=1 AND '%'='",
    "AND 1=0 AND '%'='",
    'AND 1083=1083 AND (1427=1427',
    'AND 7506=9091 AND (5913=5913',
    `AND 1083=1083 AND (1427=1427`,
    'AND 7506=9091 AND (5913=5913',
    'AND 7300=7300 AND (pKlZ=pKlZ',
    'AND 7300=7300 AND (pKlZ=pKlY',
    'AS INJECTX WHERE 1=1 AND 1=1',
    'AS INJECTX WHERE 1=1 AND 1=0',
    'AS INJECTX WHERE 1=1 AND 1=1#',
    'AS INJECTX WHERE 1=1 AND 1=0#',
    'AS INJECTX WHERE 1=1 AND 1=1--',
    'AS INJECTX WHERE 1=1 AND 1=0--',
    'WHERE 1=1 AND 1=1',
    'WHERE 1=1 AND 1=0',
    'WHERE 1=1 AND 1=1#',
    'WHERE 1=1 AND 1=0#',
    'WHERE 1=1 AND 1=1--',
    'WHERE 1=1 AND 1=0--',
    'ORDER BY 1-- ',
    'ORDER BY 2-- ',
    'ORDER BY 3-- ',
    'ORDER BY 4-- ',
    'ORDER BY 5-- ',
    'ORDER BY 6-- ',
    'ORDER BY 7-- ',
    'ORDER BY 8-- ',
    'ORDER BY 9-- ',
    'ORDER BY 10-- ',
    'ORDER BY 11-- ',
    'ORDER BY 12-- ',
    'ORDER BY 13-- ',
    'ORDER BY 14-- ',
    'ORDER BY 15-- ',
    'ORDER BY 16-- ',
    'ORDER BY 17-- ',
    'ORDER BY 18-- ',
    'ORDER BY 19-- ',
    'ORDER BY 20-- ',
    'ORDER BY 21-- ',
    'ORDER BY 22-- ',
    'ORDER BY 23-- ',
    'ORDER BY 24-- ',
    'ORDER BY 25-- ',
    'ORDER BY 26-- ',
    'ORDER BY 27-- ',
    'ORDER BY 28-- ',
    'ORDER BY 29-- ',
    'ORDER BY 30-- ',
    'ORDER BY 31337--',
    'ORDER BY 1# ',
    'ORDER BY 2# ',
    'ORDER BY 3# ',
    'ORDER BY 4# ',
    'ORDER BY 5# ',
    'ORDER BY 6# ',
    'ORDER BY 7# ',
    'ORDER BY 8# ',
    'ORDER BY 9# ',
    'ORDER BY 10# ',
    'ORDER BY 11# ',
    'ORDER BY 12# ',
    'ORDER BY 13# ',
    'ORDER BY 14# ',
    'ORDER BY 15# ',
    'ORDER BY 16# ',
    'ORDER BY 17# ',
    'ORDER BY 18# ',
    'ORDER BY 19# ',
    'ORDER BY 20# ',
    'ORDER BY 21# ',
    'ORDER BY 22# ',
    'ORDER BY 23# ',
    'ORDER BY 24# ',
    'ORDER BY 25# ',
    'ORDER BY 26# ',
    'ORDER BY 27# ',
    'ORDER BY 28# ',
    'ORDER BY 29# ',
    'ORDER BY 30#',
    'ORDER BY 31337#',
    '1 or sleep(5)#',
    `' or sleep(5)#`,
    `' or sleep(5)#`,
    `' or sleep(5)='`,
    `' or sleep(5)='`,
    '1) or sleep(5)#',
    'ORDER BY SLEEP(5)',
    'ORDER BY SLEEP(5)--',
    'ORDER BY SLEEP(5)#',
    `ORDER BY 1,SLEEP(5),BENCHMARK(1000000,MD5('A'))`,
    `ORDER BY 1,SLEEP(5),BENCHMARK(1000000,MD5('A')),4`,
    'UNION ALL SELECT 1',
    'UNION ALL SELECT 1,2',
    'UNION ALL SELECT 1,2,3;',
    'UNION ALL SELECT 1-- ',
    `'admin' --`,
    `admin' #`,
    `'admin'/*`,
    `'admin' or '1'='1`,
  ];

  //Query db once for each snippet in potentiallyMaliciousSQL array
  for (const maliciousSnippet of potentiallyMaliciousSQL) {
    await fetch(config.API_URL, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: `query {
           ${config.SQL_TABLE_NAME}(sql: "${maliciousSnippet}") {
            ${config.SQL_COLUMN_NAME}
           }
         }`
      })
    })
      .then((res) => {
        if (!res.ok) {
          successfulQuery = false;
          blockedInjections.push(maliciousSnippet);
        }
        else allowedInjections.push(maliciousSnippet + '\n');
      })
  }
  console.log(underlined(greenBold('\nPotentially malicious queries blocked: \n\n')), blockedInjections);
  console.log(underlined(redBold('\nPotentially malicious queries allowed: \n\n')), red(allowedInjections));
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

maliciousInjectionTest.XSS = async (returnToTestMenu) => {

  let successfulQuery = true;
  const blockedInjections = [];
  const allowedInjections = [];

  const potentiallyMaliciousXSS = [
    'Block me!"',//purposefully blocked, added double quote

  ];

  //Query db once for each snippet in potentiallyMaliciousSQL array
  for (const maliciousSnippet of potentiallyMaliciousXSS) {
    await fetch(config.API_URL, {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        query: `query {
           ${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}, xss: "${maliciousSnippet}") {
            id
           }
         }`
      })
    })
      .then((res) => {
        if (!res.ok) {
          successfulQuery = false;
          blockedInjections.push(maliciousSnippet);
        }
        else allowedInjections.push(maliciousSnippet + '\n');
      })
  }
  console.log(underlined(greenBold('\nPotentially malicious queries blocked: \n\n')), blockedInjections);
  console.log(underlined(redBold('\nPotentially malicious queries allowed: \n\n')), red(allowedInjections));

}

maliciousInjectionTest.OSCommand = (returnToTestMenu) => {

}

// maliciousInjectionTest.SQL();
maliciousInjectionTest.XSS();

module.exports = maliciousInjectionTest;