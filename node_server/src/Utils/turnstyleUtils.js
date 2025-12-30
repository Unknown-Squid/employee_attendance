const fs = require("fs");
const path = require("path");

// This will be set by server.js when WebSocket connections are available
let connectedClients = [];
let registerEmployeeDataFunc = null;

// Initialize turnstyle utilities with server dependencies
const initTurnstyleUtils = (clients, registerFunc) => {
  connectedClients = clients;
  registerEmployeeDataFunc = registerFunc;
};

// Register employee to turnstyle
const registerEmployeeToTurnstyle = async (enrollment_id, name, card_number, company) => {
  try {
    if (!enrollment_id || !name || !company) {
      console.warn("⚠️ Cannot register to turnstyle: enrollment_id, name, and company are required");
      return { success: false, error: "Missing required fields" };
    }

    const imagePath = path.join(__dirname, `../../pictures/${company.toUpperCase()}/${enrollment_id}.jpg`);

    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️ Image not found for employee. Expected at: ${imagePath}`);
      return { success: false, error: `Image not found at ${imagePath}` };
    }

    // Find an active WebSocket connection
    if (!connectedClients || connectedClients.length === 0) {
      console.warn("⚠️ No turnstyle device connected. Registration will be skipped.");
      return { success: false, error: "No turnstyle device connected" };
    }

    const ws = connectedClients[0]; // Use first connected client
    const finalCardNumber = card_number || enrollment_id;

    // Create registration queue for single user
    const userData = [{
      enrollid: enrollment_id,
      name: name,
      cardNumber: finalCardNumber
    }];

    if (!registerEmployeeDataFunc) {
      console.error("❌ Register function not initialized");
      return { success: false, error: "Turnstyle registration not initialized" };
    }

    registerEmployeeDataFunc(userData, company, ws);

    console.log(`✅ Turnstyle registration initiated for ${name} (${enrollment_id})`);
    return { success: true, message: `Registration initiated for ${name}` };

  } catch (error) {
    console.error("❌ Error registering to turnstyle:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initTurnstyleUtils,
  registerEmployeeToTurnstyle
};

