//import config settings
const config = require('../qevlarConfig.json');
//import GraphQLClient
const { GraphQLClient } = require('graphql-request');

console.log(config);
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
const mealQuery = `{
    meals {
      id
      ingredients
      img
      chefId {
        name
        id
      }
      title
      category {
        meal
        id
      }
    }
  }`;

const generateDynamicBatchQuery = (count, baseQuery) => {
  const batchQueries = [];

  for (let i = 1; i <= count; i++) {
    batchQueries.push({ query: baseQuery });
  }

  return batchQueries;
};

const batchTest = (num, q, returnToTestMenu) => {
  const newBatch = generateDynamicBatchQuery(num, q);
  //   console.log('newBatch', newBatch);

  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(newBatch),
  })
    .then(async (response) => {
      console.log('res status', response.status);
      console.log('res headers', response.headers);
      console.log('resOk', response.ok);
      const responseBody = await response.text();
      if (response.ok) {
        throw new Error(redBold('You are vulernable to batch attacks'));
      } else {
        console.log(greenBold('No batches gettin by you!'));
      }
      return responseBody;
    })
    .then((data) => console.log('data', data))
    .catch((error) =>
      console.error('Error:', error.message, 'stack', error.stack)
    );

  if (returnToTestMenu) returnToTestMenu();
};

// Call the batchTest function
batchTest(batchLength, mealQuery);
module.exports = { batchTest };
