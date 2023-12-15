//MIDDLEWARE SECURITY SOLUTIONS TO PROTECT OUR TEST APIs

const qevlarSecurity = {};

//Static Query Analysis
qevlarSecurity.staticQA = (req, res, next) => {
  console.log('Made it to staticQA middleware.');
  const query = req.body;
  function validateQuery(incomingQuery) {
    let isValidated = true;
    //do static query analysis here

    return isValidated;
  }

  if (validateQuery(query)) {
    return next();
  }
  else {
    res.status(403).send('Query denied.')
  }
}
module.exports = qevlarSecurity;