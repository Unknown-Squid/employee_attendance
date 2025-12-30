import { IpAddress } from "@/app/Constant/IPAdress";

// Login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${IpAddress}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Login failed" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

// Register
export const register = async (userData) => {
  try {
    const response = await fetch(`${IpAddress}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || "Registration failed" };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

