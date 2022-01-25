const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("quadb", "root", "1126", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
