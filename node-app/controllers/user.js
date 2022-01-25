const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  const user_email = req.body.user_email;
  const user_password = req.body.user_password;
  let existingUser;

  return User.findAll({
    limit: 1,
    where: {
      user_email: user_email,
    },
  })
    .then(([user, metaData]) => {
      if (!user) {
        const error = new Error(" ⚠️ You are not registered!");
        error.statusCode = 401;
        throw error;
      }
      existingUser = user.dataValues;

      if (user_password !== existingUser.user_password) {
        const error = new Error(" ⚠️ Invalid credentials!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          user_email: existingUser.user_email,
          user_id: existingUser.user_id,
        },
        "my secret key",
        { expiresIn: "1h" }
      );
      const duration = 60 * 60 * 1000;
      const expiresIn = Date.now() + duration;
      res.status(200).json({
        user_token: token,
        user_id: existingUser.user_id,
        expiresIn: new Date(expiresIn).toISOString(),
        user_name: existingUser.user_name,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.logout = (req, res, next) => {
  const user_id = req.body.user_id;
  const last_logged_in = req.body.last_logged_in;
  User.findByPk(user_id)
    .then((user) => {
      user.last_logged_in = last_logged_in;
      return user.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: " 👍 Logged out successfully", state: 1 });
    })
    .catch((err) => {
      console.log(err);
    });
};
