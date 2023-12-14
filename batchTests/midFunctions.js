const controller = {};

controller.batch = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      console.log('Intercepted request: Array detected');
      res.status(400).send('Bad Request: Arrays not allowed');
      return; // Stop further processing
    }
    res.locals.q = req.body;
    return next(); // Continue to the next middleware
  } catch (error) {
    console.error('Error in batch middleware:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = controller;
