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

const query = {
  // "query": "query " + `"${config.TOP_LEVEL_FIELD} {${config.SUB_FIELD}}}`
  query: `query { ${config.TOP_LEVEL_FIELD} { ${config.SUB_FIELD} } }`
}

const generateDynamicBatchQuery = (count, baseQuery) => {
  return Array.from({ length: count }, () => baseQuery)
};


// const generateDynamicBatchQuery = (count, baseQuery) => {
//   const batchQueries = [];

//   for (let i = 1; i <= count; i++) {
//     batchQueries.push(baseQuery);
//   }

//   return batchQueries;
// };

const batchTest = (returnToTestMenu) => {
  const newBatch = generateDynamicBatchQuery(batchLength, query);
  // const stringifyNewBatch = JSON.stringify(newBatch);
  console.log('newBatch: ', newBatch);


  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify([...newBatch]),
  })
    .then((res) => res.json())
    .then((res => JSON.stringify(res)))
    .then((res) => console.log('RESPONSE: ', res))
    .then((response) => {
      if (response.ok) {
        console.log(redBold('You are vulernable to batch attacks'));
        if (returnToTestMenu) returnToTestMenu();
      } else {
        console.log(greenBold('No batches gettin by you!'));
        if (returnToTestMenu) returnToTestMenu();
      }
    }
    )

  // if (returnToTestMenu) returnToTestMenu();
};

// Call the batchTest function
module.exports = { batchTest };
