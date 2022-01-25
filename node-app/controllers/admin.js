const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const clearImage = require("../util/file");
const User = require("../models/user");
const { validationResult } = require("express-validator/check");

const isAuth = (req, res, next, cb) => {
  if (!req.isAuth) {
    const error = new Error(
      " ⚠️ Not Authorized!. Please Login to continue ..."
    );
    error.statusCode = 401;
    throw error;
  }
  try {
    cb();
  } catch (err) {
    next(err);
  }
};

exports.getUsers = (req, res, next) => {
  User.findAll({
    order: [["created_at", "DESC"]],
  })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(" 😞 Something went wrong :(");
      error.statusCode = 500;
      next(error);
    });
};

exports.postAddUser = (req, res, next) => {
  const user_name = req.body.user_name;
  const user_email = req.body.user_email;
  const user_password = req.body.user_password;
  const total_orders = +req.body.total_orders;
  const created_at = new Date().toISOString();
  const last_logged_in = null;
  const errors = validationResult(req);

  if (total_orders !== parseInt(total_orders)) {
    const error = new Error(" ⚠️ Total orders can't be float!");
    error.statusCode = 422;
    throw error;
  }
  if (parseInt(total_orders) < 0) {
    const error = new Error(" ⚠️ Total orders can't be negative!");
    error.statusCode = 422;
    throw error;
  }

  console.log(typeof total_orders);
  isAuth(req, res, next, () => {
    if (!errors.isEmpty()) {
      const error = new Error("validation failed");
      error.statusCode = 422;
      error.message = errors.array()[0].msg;
      throw error;
    }
    if (!req.file) {
      const error = new Error(" ⚠️ Image is required!");
      error.statusCode = 201;
      throw error;
    }
    const user_image = req.file.path;

    return User.create({
      user_name: user_name,
      user_email: user_email,
      user_password: user_password,
      user_image: user_image,
      total_orders: total_orders,
      created_at: created_at,
      last_logged_in: last_logged_in,
    }).then((result) => {
      res
        .status(201)
        .json({ message: " 😊 User added successfully!", state: 1 });
    });
  });
};

exports.getUserDetails = (req, res, next) => {
  const user_id = req.params.userId;
  return User.findByPk(user_id)
    .then((user) => {
      if (!user) {
        const error = new Error(" ⚠️ User record not found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateUser = (req, res, next) => {
  const user_id = req.body.user_id;
  const updatedUser_name = req.body.user_name;
  const updatedUser_email = req.body.user_email;
  const updatedUser_password = req.body.user_password;
  const updatedTotal_orders = +req.body.total_orders;
  const errors = validationResult(req);
  let existingUser_image;

  if (updatedTotal_orders !== parseInt(updatedTotal_orders)) {
    const error = new Error(" ⚠️ Total orders can't be float!");
    error.statusCode = 422;
    throw error;
  }
  if (parseInt(updatedTotal_orders) < 0) {
    const error = new Error(" ⚠️ Total orders can't be negative!");
    error.statusCode = 422;
    throw error;
  }

  isAuth(req, res, next, () => {
    if (!errors.isEmpty()) {
      const error = new Error("validation failed");
      error.statusCode = 422;
      error.message = errors.array()[0].msg;
      throw error;
    }

    return User.findByPk(user_id)
      .then((user) => {
        if (!user) {
          const error = new Error(" ⚠️ User not found!");
          error.statusCode = 404;
          error.data = null;
          throw error;
        }
        if (req.file) {
          existingUser_image = user.user_image;
          user.user_image = req.file.path;
        }
        user.user_name = updatedUser_name;
        user.user_email = updatedUser_email;
        user.user_password = updatedUser_password;
        user.total_orders = updatedTotal_orders;

        return user.save();
      })
      .then((result) => {
        if (existingUser_image) {
          clearImage(existingUser_image);
        }
        res
          .status(201)
          .json({ message: " 😊 User updated successfully  !", state: 1 });
      });
  });
};

exports.getUserImage = (req, res, next) => {
  const user_id = req.params.userId;
  User.findByPk(user_id)
    .then((user) => {
      if (!user) {
        const error = new Error(" ⚠️ Record not found!");
        error.statusCode = 404;
        throw error;
      }
      const user_image = user.dataValues.user_image;
      res.status(200).json({ user_image });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const user_id = req.params.userId;
  let imageUrl;
  isAuth(req, res, next, () => {
    return User.findByPk(user_id)
      .then((user) => {
        if (!user) {
          const error = new Error(" ⚠️ User doesn't exists !");
          error.statusCode = 401;
          throw error;
        }
        imageUrl = user.user_image;
      })
      .then((result) => {
        return User.destroy({
          where: {
            user_id: user_id,
          },
        });
      })
      .then((result) => {
        if (!result) {
          const error = new Error(" ⚠️ Delete Operation Failed!");
          error.statusCode = 500;
          throw error;
        }
        clearImage(imageUrl);
        res.status(200).json({
          message: " 👍 User deleted successfully!",
          state: 1,
        });
      });
  });
};

exports.signup = (req, res, next) => {
  const admin_name = req.body.admin_name;
  const admin_email = req.body.admin_email;
  const admin_password = req.body.admin_password;
  const admin_confirmPassword = req.body.admin_confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("validation failed");
    error.statusCode = 422;
    error.message = errors.array()[0].msg;
    throw error;
  }
  if (admin_password !== admin_confirmPassword) {
    const error = new Error(" ⚠️ Password doesn't match.");
    error.statusCode = 422;
    throw error;
  }
  return bcrypt
    .hash(admin_password, 11)
    .then((hashedPassword) => {
      return Admin.create({
        admin_name: admin_name,
        admin_email: admin_email,
        admin_password: hashedPassword,
      });
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: " 👍 Account created successfully!", state: 1 });
    })
    .catch((err) => {
      next(err);
    });
};

exports.login = (req, res, next) => {
  const admin_email = req.body.admin_email;
  const admin_password = req.body.admin_password;
  let existingAdmin;

  return Admin.findAll({
    limit: 1,
    where: {
      admin_email: admin_email,
    },
  })
    .then(([admin, metaData]) => {
      if (!admin) {
        const error = new Error(" ⚠️ You are not registered!");
        error.statusCode = 401;
        throw error;
      }
      existingAdmin = admin.dataValues;
      return bcrypt.compare(admin_password, existingAdmin.admin_password);
    })
    .then((result) => {
      console.log(result);
      if (!result) {
        const error = new Error(" ⚠️ Invalid credentials!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          admin_email: existingAdmin.admin_email,
          admin_id: existingAdmin.admin_id,
        },
        "my secret key",
        { expiresIn: "1h" }
      );
      const duration = 60 * 60 * 1000;
      const expiresIn = Date.now() + duration;
      res.status(200).json({
        admin_token: token,
        admin_id: existingAdmin.admin_id,
        expiresIn: new Date(expiresIn).toISOString(),
        admin_name: existingAdmin.admin_name,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
