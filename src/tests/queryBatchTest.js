//import config settings
const config = require('../qevlarConfig.json');

//import colors
const {
  green,
  greenBold,
  greenItalic,
  greenHighlight,
  greenUnderlined,
  greenOut,
  red,
  redBold,
  redItalic,
  redHighlight,
  redUnderlined,
  redOut,
  dark,
  darkBold,
  darkItalic,
  darkHighlight,
  darkUnderlined,
  darkOut,
  yellow,
  yellowBold,
  yellowItalic,
  yellowHighlight,
  yellowUnderlined,
  yellowOut,
  bold,
  italic,
  highlight,
  underlined,
  whiteOut,
} = require('../../color');

const url = config.API_URL;
const batchLength = config.BATCH_SIZE;
// const mealQuery = `{
//     meals { //top level field
//       id // sub field
//       ingredients
//       img
//       chefId {
//         name
//         id
//       }
//       title
//       category {
//         meal
//         id
//       }
//     }
//   }`;

const query = `{ ${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) { ${config.SUB_FIELD} ${config.SUB_FIELD} } }`;

// const query = {
//   // "query": "query " + `"${config.TOP_LEVEL_FIELD} {${config.SUB_FIELD}}}`
//   query: `query { ${config.TOP_LEVEL_FIELD} { ${config.SUB_FIELD} } }`
// }

// const generateDynamicBatchQuery = (count, baseQuery) => {
//   return Array.from({ length: count }, () => baseQuery)
// };

const generateDynamicBatchQuery = (count, baseQuery) => {
  const batchQueries = [];

  for (let i = 1; i <= count; i++) {
    batchQueries.push(baseQuery);
  }

  return batchQueries;
};

const batchTest = (returnToTestMenu) => {
  const newBatch = generateDynamicBatchQuery(batchLength, query);
  // const stringifyNewBatch = JSON.stringify(newBatch);
  // console.log('newBatch', JSON.stringify(newBatch))

  // const newBatch = generateDynamicBatchQuery(batchLength, query); // Generates an array of identical queries

  // // Prepare the batched request body
  // const batchRequestBody = newBatch.map(singleQuery => ({
  //   query: singleQuery
  // }));

  const batchedQueries = newBatch.map((query) => ({ query }));
  console.log('batchRequestBody', batchedQueries);

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(batchedQueries),
  })
    .then((res) => {
      console.log('res', res);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log('batch res', data);
    })
    .catch((error) => {
      console.error('error encountered: ', error);
    });

  // if (returnToTestMenu) returnToTestMenu();
};

// Call the batchTest function
module.exports = { batchTest };
