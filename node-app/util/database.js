const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "quadb",
  "<your user name>",
  "<your password>",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
