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
const { api, field, subfield, depthLimit } = require('../../qevlarConfig.json')

const depthLimitTest = {};

//fixed query depth of 8
depthLimitTest.fixed = () => {

  fetch(api, {
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

depthLimitTest.dynamic = () => {
  //create query body dynamically based on depth input
  function setDynamicQueryBody() {
    let dynamicQueryBody = '';
    let depth = depthLimit;
    let endOfQuery = 'id';
    while (depth > 0) {
      // `${field} {${subfield} {id}}`
      dynamicQueryBody += `${field} {${subfield} {`; //field and subfield from config
      endOfQuery += '}}';
      depth--;
    }
    return dynamicQueryBody + endOfQuery;
  }
  const dynamicQueryBody = setDynamicQueryBody();
  console.log('QUERY----> ', dynamicQueryBody);

  //make fetch
  fetch(api, {
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
    // .then((res) => res.json())
    // .then((res) => JSON.stringify(res))
    // .then((res) => console.log(res))
    .then((res) => {
      if (res.status < 200 || res.status > 299) {
        console.log(greenBold('Test passed: ') + highlight(`Query depth limited above ${depthLimit} queries.`));
      }
      else console.log(redBold('Test failed: ') + highlight(`Query depth not limited below ${depthLimit}.`));
    })

}

// depthLimitTest.fixed();
depthLimitTest.dynamic();