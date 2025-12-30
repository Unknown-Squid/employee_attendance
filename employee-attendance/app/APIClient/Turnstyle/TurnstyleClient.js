import { IpAddress } from "@/app/Constant/IPAdress";

// Register employee to turnstyle device via WebSocket
export const registerToTurnstyle = async (employeeData) => {
  try {
    const response = await fetch(`${IpAddress}/register-to-turnstyle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Failed to register to turnstyle" };
    }
  } catch (error) {
    console.error("Turnstyle registration error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

