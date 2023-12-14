//MIDDLEWARE SECURITY SOLUTIONS TO PROTECT OUR TEST APIs

const qevlarSecurity = {};

//Static Query Analysis
qevlarSecurity.staticQA = (req, res, next) => {
  // function validateQuery(incomingQuery) {
  //   //do static query analysis here
  //   throw new Error('Sorry no!');
  // }

  // try {
  //   const query = req.body;
  //   validateQuery(query);
  // }
  // catch (err) {
  return next({
    log: `Express error during staticQA middleware:`,
    status: 500,
    message: { err: 'QUERY REJECTED' }
  })
  // }
  // res.status(500).send('QUERY REJECTED');
}
module.exports = qevlarSecurity;