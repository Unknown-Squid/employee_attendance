// Import the Express library to create a web server and handle routing
const express = require("express"); 
// Create a new router instance to define route handlers separately from the main app
// This router can be used to modularize route definitions and then be mounted on the main Express app
const router = express.Router(); 

// Controller
// account list
const EmpAttController = require("../Controllers/EmpAttController");

// -------- POST --------
router.post("/create-attendance", EmpAttController.manageEmpAttendance);
router.post("/manage-employee-attendance", EmpAttController.manageEmpAttendance); // Keep for backward compatibility

// -------- GET --------
router.get("/fetch-emp-att-rec-today", EmpAttController.fetchEmpAttRecToday);
router.get("/get-emp-att-data", EmpAttController.getEmpAttData);

module.exports = router;