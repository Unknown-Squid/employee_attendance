// Import the Express library to create a web server and handle routing
const express = require("express"); 
// Create a new router instance to define route handlers separately from the main app
// This router can be used to modularize route definitions and then be mounted on the main Express app
const router = express.Router(); 

// Controller
// account list
const EmpAccController = require("../Controllers/EmpAccController");

// -------- POST ROUTES --------
router.post("/register", EmpAccController.createEmpAcc);
router.post("/login", EmpAccController.loginEmpAcc);
router.post("/create-emp-acc", EmpAccController.createEmpAcc); // Keep for backward compatibility

// -------- GET ROUTES --------
router.get("/get-emp-acc-data", EmpAccController.getEmpAccData);

// -------- UPDATE ROUTE --------
router.put("/update-emp-acc-data", EmpAccController.updateEmpAccData);

module.exports = router;