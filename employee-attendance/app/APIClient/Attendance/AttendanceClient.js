import { IpAddress } from "@/app/Constant/IPAdress";

// Create attendance record
export const createAttendance = async (attendanceData) => {
  try {
    const response = await fetch(`${IpAddress}/create-attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || data.message || "Failed to record attendance" };
    }
  } catch (error) {
    console.error("Attendance error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// Get attendance records
export const getAttendanceRecords = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${IpAddress}/get-emp-att-data?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Failed to fetch attendance records" };
    }
  } catch (error) {
    console.error("Get attendance error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// Get today's attendance records
export const getTodayAttendance = async (date) => {
  try {
    const response = await fetch(`${IpAddress}/fetch-emp-att-rec-today?date=${encodeURIComponent(date)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Failed to fetch today's attendance" };
    }
  } catch (error) {
    console.error("Get today attendance error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

