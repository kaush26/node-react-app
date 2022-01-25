const { Sequelize } = require("sequelize");
const sequelize = require("../util/database");

const Admin = sequelize.define("admin", {
  admin_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  admin_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  admin_email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  admin_password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Admin;
