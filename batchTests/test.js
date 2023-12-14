//create function for batch queries
const url = '/graphql';
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

const batchTest = (num, q) => {
  const newBatch = generateDynamicBatchQuery(num, q);

  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(newBatch),
  })
    .then((response) => {
      console.log('response', response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
};

// Call the batchTest function
batchTest(10, mealQuery);
