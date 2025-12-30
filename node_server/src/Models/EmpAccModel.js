const { DataTypes } = require("sequelize");
const sequelize = require("../../Configs/dbConfig"); // Adjust path

const EmployeeAccount = sequelize.define(
  "EmployeeAccount",
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    enrollment_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    card_number: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      // Store the HASHED password, not plain text
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "employee_account",
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);

module.exports = EmployeeAccount;
