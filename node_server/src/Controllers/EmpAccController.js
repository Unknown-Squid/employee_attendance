const EmpAccService = require("../Services/EmpAccService");

// -------- CREATE CONTROLLER --------
const createEmpAcc = async (req, res) => {
    try {
      const data = req.body;
      const newUser = await EmpAccService.createEmpAcc(data);

      // Automatically register to turnstyle if enrollment_id and company are provided
      if (newUser.enrollment_id && newUser.company) {
        // Import turnstyle utilities
        const turnstyleUtils = require("../Utils/turnstyleUtils");
        
        // Register to turnstyle (non-blocking, don't wait for result)
        turnstyleUtils.registerEmployeeToTurnstyle(
          newUser.enrollment_id,
          newUser.name,
          newUser.card_number,
          newUser.company
        ).then(result => {
          if (result.success) {
            console.log(`✅ Employee ${newUser.name} registered to turnstyle`);
          } else {
            console.warn(`⚠️ Turnstyle registration skipped: ${result.error}`);
          }
        }).catch(err => {
          console.error("❌ Turnstyle registration error:", err);
        });
      }

      return res.status(201).json({
        message: "Employee account created successfully.",
        user: newUser,
      });
    } catch (error) {
      console.error("Error in createEmpAccController:", error.message);
      return res.status(400).json({ error: error.message });
    }
};

// -------- READ CONTROLLER --------
const getEmpAccData = async (req, res) => {
    try {
      const filters = req.query; // Accept filters via query parameters
      const users = await EmpAccService.getEmpAccData(filters);

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error in getEmpAccDataController:", error.message);
      return res.status(500).json({ error: "Failed to retrieve employee account data." });
    }
};

// -------- LOGIN CONTROLLER --------
const loginEmpAcc = async (req, res) => {
    try {
      const data = req.body;
      const user = await EmpAccService.loginEmpAcc(data);

      return res.status(200).json({
        message: "Login successful.",
        user: user,
      });
    } catch (error) {
      console.error("Error in loginEmpAccController:", error.message);
      return res.status(401).json({ error: error.message });
    }
};

// -------- UPDATE CONTROLLER --------
const updateEmpAccData = async (req, res) => {
    try {
      const data = req.body;
      const result = await EmpAccService.updateEmpAccData(data);

      if (result[0] === 0) {
        return res.status(404).json({ message: "No matching record found or no changes made." });
      }

      return res.status(200).json({ message: "Employee account data updated successfully." });
    } catch (error) {
      console.error("Error in updateEmpAccDataController:", error.message);
      return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createEmpAcc,
    loginEmpAcc,
    getEmpAccData,
    updateEmpAccData,
};