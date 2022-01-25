const router = require("express").Router();
const userController = require("../controllers/user");

router.post("/login", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
