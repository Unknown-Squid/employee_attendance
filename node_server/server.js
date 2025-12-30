const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const csv = require("csv-parser");

const sequelize = require("./Configs/dbConfig");
require("dotenv").config();

/* ----- DEFAULT SETUP ----- */
// for turn style default server API
const API_URL = "https://global.yunatt.com/api/v2/addUser";
const API_TOKEN = "8d6bea78-a7ad-4eee-bcf7-03724af319fc";
const cus_id = 389;

/* ----- SERVER OWNED SETUP ----- */
// server config
const app = express();
app.set("trust proxy", 1);
const PORT = 3001;
const userTimes = {};

const server = http.createServer(app);

const LARAVEL_API_URL = process.env.LARAVEL_API_URL;

// Middleware
app.use(bodyParser.json());
app.use(cors());


// Import routes
const EmpAccRoute = require("./src/Routes/EmpAccRoute");
const EmpAttRoute = require("./src/Routes/EmpAttRoute");

// Routes
app.use("/", EmpAccRoute);
app.use("/", EmpAttRoute);

// -------- WebSocket Registration Route --------
// Register employee to turnstyle via WebSocket
app.post("/register-to-turnstyle", async (req, res) => {
  try {
    const { enrollment_id, name, card_number, company } = req.body;

    if (!enrollment_id || !name || !company) {
      return res.status(400).json({
        error: "enrollment_id, name, and company are required"
      });
    }

    // Check if employee exists in database
    const EmpAccService = require("./src/Services/EmpAccService");
    const employees = await EmpAccService.getEmpAccData({ enrollment_id });

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        error: "Employee not found. Please add employee first."
      });
    }

    const employee = employees[0];
    const imagePath = path.join(__dirname, `/pictures/${company.toUpperCase()}/${enrollment_id}.jpg`);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        error: `Image not found for employee. Expected at: ${imagePath}`
      });
    }

    const base64Photo = fs.readFileSync(imagePath).toString("base64");
    const finalCardNumber = card_number || employee.card_number || enrollment_id;

    // Find an active WebSocket connection
    if (connected_client.length === 0) {
      return res.status(503).json({
        error: "No turnstyle device connected. Please connect a device first."
      });
    }

    const ws = connected_client[0]; // Use first connected client

    // Create registration queue for single user
    const userData = [{
      enrollid: enrollment_id,
      name: name,
      cardNumber: finalCardNumber
    }];

    registerEmployeeData(userData, company, ws);

    res.json({
      success: true,
      message: `Registration initiated for ${name} (${enrollment_id})`,
      enrollment_id,
      company
    });

  } catch (error) {
    console.error("Error registering to turnstyle:", error);
    res.status(500).json({
      error: "Failed to register employee to turnstyle",
      details: error.message
    });
  }
});

// ---------- script for saving the csv file recieve from the client
// csv folder for registration of user directly to turn style
const csv_template_directory = path.join(__dirname, '/csv_templates');
const pictures_directory = path.join(__dirname, '/pictures');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, csv_template_directory); // Save files here
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// // Start WebSocket server
let connected_client = [];

const youcodeEmployeeData = [
  {
    name: "Dan Paguiligan",
    enrollid: 20240003,
    cardNumber: 20240003,
  },
  {
    name: "Arianne-Lyn Combate",
    enrollid: 20240004,
    cardNumber: 20240004,
  },
  {
    name: "Neil John A. Gonzales",
    enrollid: 20240005,
    cardNumber: 20240005,
  },
  {
    name: "Karylle Andrei C. Velarde",
    enrollid: 20240006,
    cardNumber: 20240006,
  },
  {
    name: "Fritz Gerald F. Fegalan",
    enrollid: 20240007,
    cardNumber: 20240007,
  },
  {
    name: "Ray Andrew R. Manila",
    enrollid: 20240008,
    cardNumber: 20240008,
  },
  {
    name: "Angel Vi M. Cuenca",
    enrollid: 20240009,
    cardNumber: 20240009,
  },
  {
    name: "Orlann S. Argarin",
    enrollid: 20240010,
    cardNumber: 20240010,
  },
  {
    name: "Aaron Joshua G. Espinosa",
    enrollid: 20240012,
    cardNumber: 20240012,
  },
  {
    name: "John Filhmar D. Ola",
    enrollid: 20240013,
    cardNumber: 20240013,
  },
  {
    name: "Angelo Jeric B. Trias",
    enrollid: 20240014,
    cardNumber: 20240014,
  },
];

const gapEmployeeData = [
  {
    name: "Maricar Calot",
    enrollid: 20190004,
    cardNumber: 97921401,
  },
  {
    name: "Hazel Marie Balano",
    enrollid: 20240035,
    cardNumber: 97864468,
  },
  {
    name: "Jenellie Siguenza",
    enrollid: 20240033,
    cardNumber: 97939661,
  },
  {
    name: "Kathleen Sacramento",
    enrollid: 97861978,
    cardNumber: 97861978,
  },
  {
    name: "Janna Hate",
    enrollid: 97955564,
    cardNumber: 97955564,
  },
  {
    name: "Mark Jayson Enverzo",
    enrollid: 20230027,
    cardNumber: 97812341,
  },
  {
    name: "Mark Lyndon Decena",
    enrollid: 20240031,
    cardNumber: 97812421,
  },
  {
    name: "Eddie Zan Penalosa",
    enrollid: 20190018,
    cardNumber: 954505714,
  },
  {
    name: "Rustico fernandez",
    enrollid: 20190005,
    cardNumber: 97955564,
  },
  {
    name: "Vernadeth Delfin",
    enrollid: 20240032,
    cardNumber: 20240032,
  },
  {
    name: "Ronel Boholano",
    enrollid: 20230029,
    cardNumber: 20230029,
  },
  {
    name: "Romeo Jacoba",
    enrollid: 20230028,
    cardNumber: 20230028,
  },
  {
    name: "Arjay Pangangan",
    enrollid: 20240030,
    cardNumber: 20240030,
  },
  {
    name: "Carlo Nuyda",
    enrollid: 20230026,
    cardNumber: 20230026,
  },
  {
    name: "Javieralyn Medrano",
    enrollid: 202300262,
    cardNumber: 202300262,
  },


  {
    name: "Ca Bits",
    enrollid: 100000,
    cardNumber: 100000,
  },
  {
    name: "Angel",
    enrollid: 300000,
    cardNumber: 300000,
  },
  {
    name: "Allan",
    enrollid: 400000,
    cardNumber: 400000,
  },
  {
    name: "CHELSEA CANARES",
    enrollid: 20092003,
    cardNumber: 600000,
  }
];

const vmcEmployeeData = [
  {
    name: "Raymond Bentoy",
    enrollid: 1002,
    cardNumber: 1002,
  },
  {
    name: "Frederick Malelang",
    enrollid: 1003,
    cardNumber: 1003,
  },
  {
    name: "Margie Sodoy",
    enrollid: 1004,
    cardNumber: 1004,
  },
  {
    name: "John Carmelo Cervas",
    enrollid: 1007,
    cardNumber: 1007,
  },
  {
    name: "Ernest Ross Gerand Calo",
    enrollid: 1008,
    cardNumber: 1008,
  },
  {
    name: "Axl Adrian Mallari",
    enrollid: 1009,
    cardNumber: 1009,
  },
  {
    name: "Jordiane Ramirez",
    enrollid: 1010,
    cardNumber: 1010,
  },
  {
    name: "Kriztia Farinas",
    enrollid: 1011,
    cardNumber: 1011,
  },
  {
    name: "Reyan Christian Reginaldo",
    enrollid: 1012,
    cardNumber: 1012,
  }
];

const otherData = [
  {
    name: "Peter Krohn",
    enrollid: 97849995,
    cardNumber: 97849995,
  },
  {
    name: "Glenn Vernon",
    enrollid: 97841225,
    cardNumber: 97841225,
  },
  {
    name: "Andrew Combate",
    enrollid: 97899941,
    cardNumber: 97899941,
  },
  {
    name: "Sarina Dee-Combate",
    enrollid: 97950732,
    cardNumber: 97950732,
  }
];

// Registration queue system
const registrationQueues = new Map(); // ws -> queue

const createRegistrationQueue = (data, company, ws) => {
  const queue = [];
  
  data.forEach((item) => {
    const enrollid = item.enrollid;
    const test_name = item.name;
    const imagePath = path.join(__dirname, `/pictures/${company.toUpperCase()}/${enrollid}.jpg`);

    if (!fs.existsSync(imagePath)) {
      console.warn(`Image not found: ${imagePath}`);
      return;
    }

    const base64Photo = fs.readFileSync(imagePath).toString("base64");

    // Add all commands to queue for this user
    queue.push(
      // 1. Add user command
      {
        type: 'adduser',
        data: {
          cmd: "adduser",
          enrollid,
          backupnum: 20,
          admin: 0,
          name: test_name,
          flag: 10,
        },
        userInfo: { enrollid, test_name, base64Photo, cardNumber: item.cardNumber }
      },
      // 2. Set user info with photo (backupnum 20)
      {
        type: 'setuserinfo',
        data: {
          cmd: "setuserinfo",
          enrollid,
          backupnum: 20,
          admin: 0,
          name: test_name,
          record: base64Photo,
        },
        userInfo: { enrollid, test_name, base64Photo, cardNumber: item.cardNumber }
      },
      // 3. Set user info with photo (backupnum 50)
      {
        type: 'setuserinfo',
        data: {
          cmd: "setuserinfo",
          enrollid,
          backupnum: 50,
          admin: 0,
          name: test_name,
          record: base64Photo,
        },
        userInfo: { enrollid, test_name, base64Photo, cardNumber: item.cardNumber }
      },
      // 4. Set user info with card number (backupnum 11)
      {
        type: 'setuserinfo',
        data: {
          cmd: "setuserinfo",
          enrollid,
          backupnum: 11,
          admin: 0,
          name: test_name,
          record: item.cardNumber,
        },
        userInfo: { enrollid, test_name, base64Photo, cardNumber: item.cardNumber }
      }
    );
  });

  return queue;
};

const processRegistrationQueue = (ws) => {
  const queue = registrationQueues.get(ws);
  if (!queue || queue.length === 0) {
    console.log("✅ Registration queue completed for this WebSocket");
    registrationQueues.delete(ws);
    return;
  }

  const nextCommand = queue.shift();
  console.log(`📤 Sending ${nextCommand.type} for ${nextCommand.userInfo.test_name} (${nextCommand.userInfo.enrollid})`);
  
  ws.send(JSON.stringify(nextCommand.data));
};

const registerEmployeeData = (data, company, ws) => {
  // Send registration confirmation first
  ws.send(
    JSON.stringify({
      ret: "reg",
      result: true,
      cloudtime: new Date().toISOString(),
      nosenduser: true,
    })
  );

  // Create and store registration queue
  const queue = createRegistrationQueue(data, company, ws);
  if (queue.length > 0) {
    registrationQueues.set(ws, queue);
    // Start processing the queue
    processRegistrationQueue(ws);
  }
}

// Initialize turnstyle utils with server dependencies
turnstyleUtils.initTurnstyleUtils(connected_client, registerEmployeeData);

// Import turnstyle utilities
const turnstyleUtils = require("./src/Utils/turnstyleUtils");

// ✅ Pass HTTP server to WebSocket
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("✅ Terminal connected!");
  connected_client.push(ws);

  ws.on("message", async (message) => {
    const text = Buffer.isBuffer(message) ? message.toString("utf8") : message;

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Invalid JSON:", text);
      return;
    }

    // --- Handle registration ---
    if (data.cmd === "reg") {
      console.log("✅ Terminal sent reg message:", data);

      // registerEmployeeData(youcodeEmployeeData, "youcode", ws);
      // registerEmployeeData(gapEmployeeData, "gap", ws);
      // registerEmployeeData(vmcEmployeeData, "vmc", ws);
      // registerEmployeeData(otherData, "gap", ws);
      
      return;
    }

    // --- Handle adduser response ---
    if (data.ret === "adduser") {
      if (data.result) {
        console.log(`✅ User added successfully: ${data.enrollid}`);
      } else {
        console.error(`❌ Failed to add user ${data.enrollid}. Reason:`, data.reason);
      }
      // Continue processing queue regardless of success/failure
      processRegistrationQueue(ws);
      return;
    }

    // --- Handle setuserinfo response ---
    if (data.ret === "setuserinfo") {
      if (data.result) {
        console.log(`✅ User info set successfully: ${data.enrollid} (backupnum: ${data.backupnum})`);
      } else {
        console.error(`❌ Failed to set user info for ${data.enrollid} (backupnum: ${data.backupnum}). Reason:`, data.reason);
      }
      // Continue processing queue regardless of success/failure
      processRegistrationQueue(ws);
      return;
    }

    // --- Handle sendlog ---
    if (data.cmd === "sendlog") {
      console.log("✅ Received sendlog from terminal.");

      for (const record of data.record) {
        console.log({
          enrollId: record.enrollid,
          time: record.time,
          mode: record.mode,
          inout: record.inout,
          temp: record.temp,
          event: record.event,
        });

        // Save time_in or time_out
        const enrollId = record.enrollid;
        if (!userTimes[enrollId]) {
          userTimes[enrollId] = {};
        }

        if (record.inout === 0) {
          userTimes[enrollId].time_in = record.time;
          userTimes[enrollId].inout = 0;
        } else if (record.inout === 1) {
          userTimes[enrollId].time_out = record.time;
          userTimes[enrollId].inout = 1;
        }

        // Request user info
        ws.send(
          JSON.stringify({
            cmd: "getuserinfo",
            sn: data.sn,
            enrollid: enrollId,
            backupnum: 11, // RFID
          })
        );
      }

      // Reply per protocol
      ws.send(
        JSON.stringify({
          ret: "sendlog",
          result: true,
          cloudtime: new Date().toISOString(),
        })
      );

      return;
    }

    // --- Handle getuserinfo response ---
    if (data.ret === "getuserinfo") {
      if (data.result) {
        console.log("✅ getuserinfo response received.");
        console.log(data);

        const enrollId = data.enrollid;
        const times = userTimes[enrollId] || {};
        const cardNumber = String(data.record);

        // Determine time_in and time_out based on inout mode
        let time_in = null;
        let time_out = null;
        
        if (times.time_in && times.inout === 0) {
          time_in = times.time_in;
        } else if (times.time_out && times.inout === 1) {
          time_out = times.time_out;
        }

        // Get employee data from database
        const EmpAccService = require("./src/Services/EmpAccService");
        const EmpAttService = require("./src/Services/EmpAttService");
        
        try {
          const employees = await EmpAccService.getEmpAccData({ enrollment_id: enrollId });
          
          if (employees && employees.length > 0) {
            const employee = employees[0];
            const date = new Date().toISOString().split('T')[0];

            const attendanceRecord = {
              enrollment_id: enrollId,
              card_number: cardNumber,
              photo: null, // Can be added later if needed
              name: employee.name,
              position: employee.position,
              company: employee.company,
              date: date,
              time_in: time_in,
              time_out: time_out
            };

            // Save attendance record
            await EmpAttService.addEmpAttData(attendanceRecord);
            console.log(`✅ Attendance recorded for ${employee.name} (${enrollId})`);
          } else {
            console.warn(`⚠️ Employee not found in database for enrollment_id: ${enrollId}`);
          }
        } catch (error) {
          console.error("❌ Error recording attendance:", error);
        }

        // Also send to Laravel if URL is configured
        if (LARAVEL_API_URL) {
          const payload = {
            enrollment_id: enrollId,
            card_number: cardNumber,
            time_in: time_in,
            time_out: time_out,
          };

          console.log("➡ Sending payload to Laravel:", payload);

          try {
            const response = await axios.post(LARAVEL_API_URL, payload);
            console.log("✅ Laravel API response:", response.data);
          } catch (error) {
            console.error("❌ Failed to send to Laravel:", error.message);
          }
        }
      } else {
        console.error("❌ getuserinfo failed. Reason:", data.reason);
      }

      return;
    }

    // --- Handle opendoor response ---
    if (data.ret === "opendoor") {
      if (data.result) {
        console.log("✅ Door opened successfully!");
      } else {
        console.log("❌ Failed to open door. Reason:", data.reason);
      }
      return;
    }
  });

  ws.on("close", () => {
    console.log("Terminal disconnected.");
    // Clean up registration queue for this WebSocket
    registrationQueues.delete(ws);
  });
});
/**
 * Helper to send a message to the WebSocket safely
 */
const sendWsToAll = (payload) => {
  connected_client.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  });
}

// Upload and process CSV
app.post("/save-csv-file", upload.single("csvfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", async () => {
      let count = 1;
      for (const row of results) {
        const full_name = `${row.fname} ${row.mname} ${row.lname}`;
        try {
          const enrollid = parseInt(row.LRN);
          const name = full_name;
          const admin = 0;

          const backupnum = 20; // photo
          const flag = 10;

          let photoBase64 = "";


          if (full_name || row.LRN) {
            var photoPath = "";

            if (row.LRN){
              photoPath = path.join(pictures_directory, `/${row.section}/${full_name}_${row.LRN}_F.jpg`);
            } else {
              photoPath = path.join(pictures_directory, `/${row.section}/${full_name}_F.jpg`);
            }
            if (fs.existsSync(photoPath)) {
              const photoBuffer = fs.readFileSync(photoPath);
              photoBase64 = photoBuffer.toString("base64");
              console.log("test", photoBase64[0])
            } else {
              console.warn(`⚠ Photo file not found: ${photoPath}`);
            }
          }

          sendWsToAll({
            cmd: "adduser",
            enrollid,
            backupnum,
            admin,
            name,
            flag,
          });

          sendWsToAll({
            cmd: "setuserinfo",
            enrollid,
            backupnum,
            admin,
            name,
            record: photoBase64,
          });

          sendWsToAll({
            cmd: "setuserinfo",
            enrollid,
            backupnum: 50,
            admin,
            name,
            record: photoBase64,
          });

          sendWsToAll({
            cmd: "setuserinfo",
            enrollid,
            backupnum: 11,
            admin,
            name,
            record: parseInt(row.rfid),
          });

          count++;

          console.log(`✅ Sent adduser and setuserinfo for ${name} (ID: ${enrollid})`);
        } catch (err) {
          console.error("❌ Error processing row:", row, err.message);
        }
      }

      res.json({
        message: "CSV processed and users sent to terminal!",
        rows: results.length,
      });
    });
});


// Upload and process CSV
// Endpoint for React form data
app.post("/save-data", async (req, res) => {
  try {
    const { name, company, cardNumber, image } = req.body;

    console.log(name, company, cardNumber, image)

    if (!name || !cardNumber) {
      return res.status(400).json({ error: "Name and Card Number are required." });
    }

    const enrollid = parseInt(cardNumber);
    const backupnum = 20;
    const flag = 10;
    const admin = 0;

    // Optional: Save image to disk (still works)
    if (image) {
      const buffer = Buffer.from(image, "base64");
      const filePath = path.join(pictures_directory, `${name}_${cardNumber}_F.jpg`);
      fs.writeFileSync(filePath, buffer);
    }

    // Simulate device communication
    sendWsToAll({ cmd: "adduser", enrollid, backupnum, admin, name, flag });
    if (image) {
      sendWsToAll({ cmd: "setuserinfo", enrollid, backupnum, admin, name, record: image });
      sendWsToAll({ cmd: "setuserinfo", enrollid, backupnum: 50, admin, name, record: image });
    }
    sendWsToAll({ cmd: "setuserinfo", enrollid, backupnum: 11, admin, name, record: enrollid });

    return res.json({ message: "User saved successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

// --- Sync ALL models (User, Session, etc.) and Start Server ---
sequelize
  .sync()
  .then(() => {
    console.log("Database models synced (including sessions table)");
  })
  .catch((err) => {
    console.error("Database model sync failed:", err);
    process.exit(1);
  });


// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
