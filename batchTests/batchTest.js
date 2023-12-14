//create function for batch queries
const url = 'http://localhost:3000/graphql';
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
//

const generateDynamicBatchQuery = (count, baseQuery) => {
  const batchQueries = [];

  for (let i = 1; i <= count; i++) {
    batchQueries.push({ query: baseQuery });
  }

  return batchQueries;
};

const batchTest = (num, q, returnToTestMenu) => {
  const newBatch = generateDynamicBatchQuery(num, q);

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
      const responseBody = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
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
batchTest(10, mealQuery);
