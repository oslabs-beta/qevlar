const controller = {};

controller.batch = async (req, res, next) => {
  console.log('req', req);

  return next();
};

module.exports = controller;
