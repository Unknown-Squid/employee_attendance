require("dotenv").config();
const sequelize = require("../Configs/dbConfig");
const EmpAccModel = require("../Models/EmpAccModel");
const bcrypt = require("bcrypt");

async function createTestUser() {
  try {
    // Sync database
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Sync model
    await EmpAccModel.sync();
    console.log("Model synced.");

    // Test user data
    const testUser = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      enrollment_id: 999999,
      card_number: 999999,
      position: "Software Engineer",
      company: "GAP",
    };

    // Check if user already exists
    const existingUser = await EmpAccModel.findOne({
      where: { email: testUser.email },
    });

    if (existingUser) {
      console.log("❌ Test user already exists!");
      console.log("Email:", existingUser.email);
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testUser.password, saltRounds);

    // Create user
    const newUser = await EmpAccModel.create({
      ...testUser,
      password: hashedPassword,
    });

    console.log("✅ Test user created successfully!");
    console.log("\n--- Test User Credentials ---");
    console.log("Email:", testUser.email);
    console.log("Password:", testUser.password);
    console.log("Name:", testUser.name);
    console.log("Company:", testUser.company);
    console.log("Enrollment ID:", testUser.enrollment_id);
    console.log("\nYou can now login with these credentials.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();

