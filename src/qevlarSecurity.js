//MIDDLEWARE SECURITY SOLUTIONS TO PROTECT OUR TEST APIs

const qevlarSecurity = {};

//Static Query Analysis
qevlarSecurity.staticQA = (req, res, next) => {
  //do static query analysis here
  return next();
}
module.exports = qevlarSecurity;