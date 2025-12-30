import { IpAddress } from "@/app/Constant/IPAdress";


const GetEmpAttRecords = async (date) => {
  try {
    const response = await fetch(`${IpAddress}/fetch-emp-att-rec-today?date=${encodeURIComponent(date)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("❌ Server responded with:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("🔥 Fetch error:", error);
  }
};

export {
  GetEmpAttRecords,
};
