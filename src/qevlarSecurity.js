//MIDDLEWARE SECURITY SOLUTIONS TO PROTECT OUR TEST APIs

const fs = require('fs');
const path = require('path');
// Get config file
const configPath = path.resolve(__dirname, './qevlarConfig.json');
// Read config file
let config = {};
try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  // Set config object
  config = JSON.parse(configFile);
} catch (error) {
  console.error('Error reading config file:', error);
}

const qevlarSecurity = {};

//Static Query Analysis
qevlarSecurity.staticQA = (req, res, next) => {

  //get query string from POST request body
  const query = req.body.query;
  // console.log('query ---> ', query)
  //helper func to validate query depth
  function validateQuery(incomingQuery) {
    let isValidated = true;
    let depthCounter = 0;

    //iterate over query
    for (const char of incomingQuery) {
      //each open bracket adds to depth counter
      if (char === '{') {
        depthCounter++
      }
    }
    //if depth counter over depth limit, don't validate
    isValidated = depthCounter <= config.QUERY_DEPTH_LIMIT;

    // console.log(`Query depth of ${depthCounter} validated? ${isValidated}`)
    return isValidated;
  }

  //query validated, continue to next middleware
  if (validateQuery(query)) {
    return next();
  }
  //query NOT validated, do not continue to next middleware
  else {
    res.status(403).json('Query denied.')
  }
}

module.exports = qevlarSecurity;