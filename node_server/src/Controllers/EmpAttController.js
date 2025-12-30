const EmpAttService = require("../Services/EmpAttService");
const EmpAccService = require("../Services/EmpAccService");

// -------- CREATE CONTROLLER --------
const manageEmpAttendance = async (req, res) => {
    try {
        const {
            enrollment_id,
            card_number,
            photo,
            time_in,
            time_out
        } = req.body;

        const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Fetch employee data
        const employees = await EmpAccService.getEmpAccData({enrollment_id: enrollment_id});

        if (!employees || employees.length === 0) {
        return res.status(404).json({
            status: 'error',
            message: 'Employee data not found.'
        });
        }

        const employee = employees[0]; // Get first match

        const attendanceRecord = {
            enrollment_id,
            card_number,
            photo,
            name: employee.name,
            position: employee.position,
            company: employee.company,
            date: date,
            time_in,
            time_out
        }

        // Store attendance record
        const newEmpAttData = await EmpAttService.addEmpAttData(attendanceRecord);

        return res.json({
        status: 'success',
        data: newEmpAttData
        });

    } catch (error) {
        console.error("Error adding employee attendance:", error);
        return res.status(500).json({
        status: 'error',
        message: 'Failed to add employee attendance.',
        details: error.message
        });
    }
};

// -------- READ CONTROLLER --------
const getEmpAttData = async (req, res) => {
    try {
        const filters = req.query; // Accept filters via query parameters
        const users = await EmpAttService.getEmpAttData(filters);
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getEmpAccDataController:", error.message);
        return res.status(500).json({ error: "Failed to retrieve employee account data." });
    }
};

const fetchEmpAttRecToday = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Fetch all records for the given date
        const records = await EmpAttService.getEmpAttData({date: date})

        // Group by LRN
        const grouped = records.reduce((acc, record) => {
            const enrollment_id = record.enrollment_id;
            if (!acc[enrollment_id]) acc[enrollment_id] = [];
            acc[enrollment_id].push(record);
            return acc;
        }, {});

        // Process each LRN's records
        const uniqueLatest = Object.entries(grouped)
        .map(([enrollment_id, items]) => {
            const withTimeIn = items.filter((item) => item.time_in);
            const withTimeOut = items.filter((item) => item.time_out);

            const latestIn = withTimeIn.sort((a, b) =>
                new Date(b.time_in) - new Date(a.time_in)
            )[0];

            const latestOut = withTimeOut.sort((a, b) =>
                new Date(b.time_out) - new Date(a.time_out)
            )[0];


            const base = latestIn || latestOut;
            if (!base) return null;

            const timeIn = latestIn ? new Date(latestIn.time_in) : null;
            const timeOut = latestOut ? new Date(latestOut.time_out) : null;

            const isInvalidOut = timeIn && timeOut && timeIn > timeOut;

            return {
                id: base.id,
                enrollment_id: enrollment_id,
                name: base.name || null,
                position: base.position || null,
                company: base.company || null,
                photo: base.photo,
                time_in: timeIn,
                time_out: isInvalidOut ? null : timeOut,
            };
        })
        .filter(Boolean); // remove nulls

        return res.status(200).json({
        date,
        attendance: uniqueLatest,
        });
    } catch (error) {
        console.error("Error fetching employee attendance:", error);
        return res.status(500).json({
        error: "Failed to fetch employee attendance.",
        });
    }
};

module.exports = {
    manageEmpAttendance,
    getEmpAttData,
    fetchEmpAttRecToday
};