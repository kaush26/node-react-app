const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    const error = new Error(" ⚠️ Please Login to continue ... ");
    error.statusCode = 422;
    throw error;
  }
  try {
    const token = authHeader.split(" ")[1];
    if (token === undefined) {
      req.isAuth = false;
      const error = new Error(" ⚠️ Please Login to continue ... ");
      error.statusCode = 422;
      throw error;
    }
    const decodedToken = jwt.verify(token, "my secret key");
    req.admin_id = decodedToken.admin_id;
    req.isAuth = true;
    next();
  } catch (err) {
    req.isAuth = false;
    next(err);
  }
};
