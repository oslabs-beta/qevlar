//MIDDLEWARE SECURITY SOLUTIONS TO PROTECT OUR TEST APIs

const qevlarSecurity = {};

//Static Query Analysis
qevlarSecurity.staticQA = (req, res, next) => {
  console.log('Made it to staticQA middleware.');
  function validateQuery(incomingQuery) {
    //do static query analysis here
    throw new Error('Sorry!')
  }

  try {
    const query = req.body;
    validateQuery(query);
  }
  catch (err) {
    return next({
      log: `Express error during staticQA middleware: ${err}`,
      status: 500,
      message: { err: 'QUERY REJECTED' }
    })
  }
  // res.status(500).send('QUERY REJECTED');
  // return next();
}
module.exports = qevlarSecurity;