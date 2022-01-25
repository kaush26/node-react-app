const express = require("express");
const adminController = require("../controllers/admin");
const Admin = require("../models/admin");
const isAuth = require("../middleware/auth");
const { check } = require("express-validator/check");
const User = require("../models/user");

const router = express.Router();

router.get("/all-users", adminController.getUsers);
router.post(
  "/insert",
  [
    check("user_name")
      .trim()
      .notEmpty()
      .withMessage(" ⚠️ User name is required!"),
    check("user_email")
      .isEmail()
      .notEmpty()
      .withMessage(" ⚠️ Please enter the valid email")
      .custom((value, { req }) => {
        return User.findOne({ where: { user_email: value } }).then((user) => {
          if (user) {
            return Promise.reject(" ⚠️ User already exists with this email!");
          }
        });
      })
      .trim()
      .normalizeEmail(),
    check("user_password")
      .notEmpty()
      .withMessage(" ⚠️ Password can't be empty")
      .isLength({ min: 5 })
      .withMessage(" ⚠️ Required password of minimum 5 chars"),
  ],
  isAuth,
  adminController.postAddUser
);
router.get("/details/:userId", adminController.getUserDetails);
router.put(
  "/update",
  [
    check("user_name").trim().notEmpty(),
    check("user_email")
      .isEmail()
      .notEmpty()
      .withMessage(" ⚠️ Please enter the valid email")
      .trim()
      .normalizeEmail(),
    check("user_password")
      .notEmpty()
      .withMessage(" ⚠️ Password cant be empty")
      .isLength({ min: 5 })
      .withMessage(" ⚠️ Required password of minimum 5 chars"),
  ],
  isAuth,
  adminController.updateUser
);
router.get("/image/:userId", adminController.getUserImage);
router.delete("/delete/:userId", isAuth, adminController.deleteUser);

router.post(
  "/signup",
  [
    check("admin_name").notEmpty().withMessage(" ⚠️ Name is required").trim(),
    check("admin_email")
      .notEmpty()
      .withMessage(" ⚠️ Email is required")
      .isEmail()
      .withMessage(" ⚠️ Enter valid email address")
      .custom((value, { req }) => {
        return Admin.findOne({
          where: {
            admin_email: value,
          },
        }).then((admin) => {
          if (admin) {
            return Promise.reject(" ⚠️ Email already taken");
          }
        });
      })
      .trim()
      .normalizeEmail(),
    check("admin_password")
      .notEmpty()
      .withMessage(" ⚠️ Password is required")
      .isLength({ min: 4 })
      .withMessage(" ⚠️ Password length must be atleast 3 chars"),
    check("admin_confirmPassword")
      .notEmpty()
      .withMessage(" ⚠️ Password is required")
      .isLength({ min: 4 })
      .withMessage(" ⚠️ Password length must be atleast 3 chars"),
  ],
  adminController.signup
);
router.post("/login", adminController.login);

module.exports = router;
