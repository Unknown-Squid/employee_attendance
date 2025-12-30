const { DataTypes } = require("sequelize");
const sequelize = require("../../Configs/dbConfig"); // Adjust path

const EmployeeAttendance = sequelize.define(
  "EmployeeAttendance",
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
    photo: {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    time_in: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    time_out: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    tableName: "employee_attendance",
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);

module.exports = EmployeeAttendance;
