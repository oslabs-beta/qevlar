const { GraphQLClient } = require('graphql-request');
const config = require('../qevlarConfig.json');
const { greenBold, highlight, redBold } = require('../../color');

async function fixedDepthTest(callback) {
  const client = new GraphQLClient(config.API_URL);
  const query = `query getCharacters {
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
  }`;

  try {
    await client.request(query);
    console.log(redBold('Test failed: ') + highlight('Query depth not limited below 9.'));
  } catch (error) {
    console.log(greenBold('Test passed: ') + highlight('Query depth limited above 7 queries.'));
  }

  if (callback) callback();
}

async function dynamicDepthTest(callback) {
  const client = new GraphQLClient(config.API_URL);
  const dynamicQuery = createDynamicQuery(config.QUERY_DEPTH_LIMIT);

  try {
    await client.request(dynamicQuery);
    console.log(redBold('Test failed: ') + highlight(`Query depth not limited below ${config.QUERY_DEPTH_LIMIT}.`));
  } catch (error) {
    console.log(greenBold('Test passed: ') + highlight(`Query depth limited above ${config.QUERY_DEPTH_LIMIT} queries.`));
  }

  if (callback) callback();
}

function createDynamicQuery(depth) {
  let queryBody = '';
  let endOfQuery = 'id';
  while (depth > 0) {
    queryBody += `${config.TOP_FIELD} {${config.SUB_FIELD} {`;
    endOfQuery += '}}';
    depth--;
  }
  return `query depthLimitTestDynamic { ${queryBody}${endOfQuery} }`;
}

module.exports = { fixedDepthTest, dynamicDepthTest };