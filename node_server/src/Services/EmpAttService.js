// Required Imports
// Import bcrypt for Password Hashing
const bcrypt = require("bcrypt");

// Models
// Employee Account Table
const EmpAttModel = require("../Models/EmpAttModel");

// -------- CREATE SERVICES --------
// Create Employee Account 
const addEmpAttData = async (data) => {
    try {
      const newEmpAttData = await EmpAttModel.create(data);
      return newEmpAttData;
    } catch (err) {
      console.error("Error adding employee attendance data:", err);
      throw err; 
    }
};

// -------- READ SERVICES --------
// Get Employee Data
const getEmpAttData = async (data) => {
    try {
      const validKeys = [
        "enrollment_id",
        "card_number",
        "photo",
        "name",
        "date",
        'position',
        'company'
      ];

      const whereClause = {};

      for (const key of validKeys) {
        if (data[key]) {
          whereClause[key] = data[key];
        }
      }

      const EmpAttData = await EmpAttModel.findAll({
        where: whereClause,
        raw: true,
      });

      return EmpAttData;
    } catch (error) {
      console.error("Error fetching employee attendance data in services:", error);
      throw error;
    }
};

module.exports = {
    addEmpAttData,
    getEmpAttData
};
