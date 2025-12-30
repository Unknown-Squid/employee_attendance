// Required Imports
// Import bcrypt for Password Hashing
const bcrypt = require("bcrypt");

// Models
// Employee Account Table
const EmpAccModel = require("../Models/EmpAccModel");

// -------- HELPER FUNCTIONS --------
// Find user by email
const findUserByEmail = async (email) => {
  try {
    const user = await EmpAccModel.findOne({
      where: { email },
      raw: true,
    });
    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// -------- CREATE SERVICES --------
// Create Employee Account (Registration)
const createEmpAcc = async (data) => {
    try {
      // Basic validation for required fields
      if (!data.email || !data.password) {
        throw new Error("Email and password are required to create a user.");
      }
      if (data.password.length < 6) {
        // Enforce minimum password length
        throw new Error("Password must be at least 6 characters long.");
      }

      // Check if a user with the same email already exists
      const existingUser = await findUserByEmail(data.email);
      if (existingUser) {
        throw new Error(`User with email ${data.email} already exists.`);
      }

      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      // Prepare user data to save, replacing plain password with hashed password
      const userToSave = {
          enrollment_id: data.enrollment_id,
          card_number: data.card_number,
          name: data.name,
          position: data.position,
          company: data.company,
          email: data.email,
          password: hashedPassword
      };

      // Log creation attempt, masking password for security
      console.log("Attempting to create employee account:", { ...userToSave, password: "[HASHED]" });

      // Create the new user record in the database
      const newUser = await EmpAccModel.create(userToSave);

      // Exclude password hash from returned user data for security
      const { password, ...userWithoutPassword } = newUser.get({ plain: true });
      return userWithoutPassword;
    } catch (error) {
      console.error("Error creating employee account in services:", error);
      // Throw specific or generic error for higher-level handling
      throw new Error(error.message || "Failed to create user.");
    }
};

// -------- AUTHENTICATION SERVICES --------
// Login Employee Account
const loginEmpAcc = async (data) => {
    try {
      // Basic validation
      if (!data.email || !data.password) {
        throw new Error("Email and password are required for login.");
      }

      // Find user by email
      const user = await findUserByEmail(data.email);
      if (!user) {
        throw new Error("Invalid email or password.");
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
      }

      // Exclude password from returned user data
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error("Error logging in employee account:", error);
      throw new Error(error.message || "Failed to login.");
    }
};

// -------- READ SERVICES --------
// Get Employee Data
const getEmpAccData = async (data) => {
    try {
      const validKeys = [
        "enrollment_id",
        "card_number",
        "name",
        "position",
        "company",
        "email"
      ];

      const whereClause = {};

      for (const key of validKeys) {
        if (data[key]) {
          whereClause[key] = data[key];
        }
      }

      const EmpAccData = await EmpAccModel.findAll({
        where: whereClause,
        raw: true,
      });

      return EmpAccData;
    } catch (error) {
      console.error("Error fetching employee account data in services:", error);
      throw error;
    }
};

// -------- UPDATE SERVICES --------
// Update Employee Account Data
const updateEmpAccData = async (data) => {
    try {
      if (!data.id) {
        throw new Error("User ID is required for update.");
      }

      const allowedFields = ['enrollment_id', 'card_number', 'name', 'position', 'company', 'email', 'password'];

      // Filter only allowed fields (excluding 'id')
      const updateFields = Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key) && key !== 'id')
      );

      // If password is being updated, hash it
      if (updateFields.password) {
        const saltRounds = 10;
        updateFields.password = await bcrypt.hash(updateFields.password, saltRounds);
      }

      const result = await EmpAccModel.update(updateFields, {
        where: { id: data.id },
      });

      return result; // Returns [numberOfAffectedRows]
    } catch (err) {
      console.error("Error updating employee account data in services:", err);
      throw err;
    }
};



module.exports = {
    createEmpAcc,
    loginEmpAcc,
    getEmpAccData,
    updateEmpAccData
};
