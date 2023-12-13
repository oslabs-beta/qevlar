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

let config = {
  field: 'name',
  queryLimit: 15,
  window: 1000
}

const configFilePath = path.resolve(__dirname, '../../qevlarConfig.json');

function loadConfig(configFilePath) {

  try {
    const userConfig = JSON.parse(fs.readFileSync(configFilePath));
    config = { ...config, ...userConfig }; //update config with user settings
  }

  catch (error) {
    console.error('Error reading or parsing qevlar config file.', error);
  }

}
const library = {};

library.basicFetch = (field) => {
  return fetch('http://localhost:5000/graphql', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query get${field} {
        ${field} {
          name
        }
      }`
    })
  })
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log((res)))
}

library.basicTest = async (field) => {
  if (await library.basicFetch(field)) {
    console.log(green('Is this green?'))
  }
}

library.dosCountTests = async () => {
  let count = 0; // number of queries
  const start = Date.now(); // time of first query
  const interval = 1000; // limit window in ms

  while (count < 15) {
    const now = Date.now();
    if (now - start < interval && await library.basicFetch(config.field)) {
      count++;
      console.log(count)
    }
    else {
      console.log(greenBold(`Rate limited below ${config.queryLimit} queries.`));
      return;
    }
  }
  console.log(redBold(`Test failed: `) + highlight(`Rate not limited below ${config.queryLimit} queries.`));
}

library.nestedFetch = () => {
  return fetch('http://localhost:5000/graphql', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query getCharacters {
        houses {
          charactersInHouse {
            id
          }
        }
      }`

    })
  })
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log(res));
}

library.nestedFetch2 = () => {
  return fetch('http://localhost:5000/graphql', {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      query: `query getCharacters {
        houses {
          charactersInHouse {
            house {
              charactersInHouse {
                house {
                  charactersInHouse {
                    house {
                      charactersInHouse {
                        house {
                          charactersInHouse {
                            id
                          }
                        }
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
    .then((res) => res.json())
    .then((res) => JSON.stringify(res))
    .then((res) => console.log(res));
}
// library.dosCountTests("books", 15);
// library.basicFetch("books");
// library.basicTest("books");
library.nestedFetch2();

module.exports = { library, loadConfig };