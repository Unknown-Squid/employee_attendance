"use client"; // Marks this file as a client component

import React, { useEffect, useState } from "react"; // Added useCallback
import axios from "axios";
import { GetEmpAttRecords } from "@/app/APIClient/Attendance/EmployeeAttendance";

export default function sf2() {

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // formats to 'YYYY-MM-DD'
    });

    const [data, setData] = useState(null);

    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState("");
    const [showModal, setShowModal] = useState(true);
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [cardNumber, setCardNumber] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result.split(",")[1]); // remove the prefix
      };
      reader.readAsDataURL(file);
    }
  };

  const getEmployeeData = async () => {
    try {
      const response = await GetEmpAttRecords(date)
      console.log("Employee Attendance Response:", response);

      setData(response.attendance);
    } catch (error) {
      console.error("Error fetching employee attendance:", error);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      name,
      company,
      cardNumber,
      image: imageBase64, // send base64 string directly
    };

    const res = await fetch("/turnstyle/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    if (date) {
      getEmployeeData()
    }
  }, [date])

  const formattedTime = (raw) => {
    const date = new Date(raw);

    // Extract and format to h:mm:ss AM/PM
    const hours = date.getUTCHours(); // use getUTCHours to avoid timezone shift
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formatted = `${hour12}:${minutes} ${ampm}`;

    return formatted
  }



  return (
    <main className="w-screen h-screen flex relative">
      <div className="relative overflow-x-auto w-full h-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                          Employee No.
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Employee Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Department
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Time In
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Time Out
                      </th>
                  </tr>
              </thead>
              <tbody>
                  {data 
                      && (data.map((item, index) => {
                          return <tr
                              key={index}
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {item.LRN ? item.LRN : "N/A"}
                                  </th>
                                  <td className="px-6 py-4">
                                      {item.name ? item.name.toUpperCase() : "N/A"}
                                  </td>
                                  <td className="px-6 py-4">
                                      {item.company ? item.company : "N/A"}
                                  </td>
                                  <td className="px-6 py-4">
                                      {item.time_in ? formattedTime(item.time_in) : "--:--"}
                                  </td>
                                  <td className="px-6 py-4">
                                      {item.time_out ? formattedTime(item.time_out) : "--:--"}
                                  </td>
                              </tr>
                      })) 
                  }
              </tbody>
          </table>
      </div>
      {/* {showModal && (
        <div className="w-full h-full bg-black/[.6] absolute top-0 left-0 flex items-center justify-center">
            <div className="bg-white w-[30%] h-fit rounded-[20px] flex flex-col gap-5">
              <div className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 w-full h-fit py-4 px-4 rounded-t-[20px] text-[24px] text-bold text-white">
                  User Registration
              </div>
              <div className="flex flex-col gap-5 h-fit w-full py-6 px-4">
                <div className="w-full h-fit flex items-center justify-center">
                  <div className="w-[250px] h-[250px] border border-black relative group overflow-hidden rounded-md">
                    {image ? (
                      <>
                        <img
                          src={image}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute top-0 left-0 w-full h-full bg-black/60 opacity-0 group-hover:opacity-100 text-white flex items-center justify-center cursor-pointer transition">
                          Replace Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </>
                    ) : (
                      <label className="w-full h-full flex items-center justify-center cursor-pointer">
                        <span className="text-gray-500">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label>
                      Name:
                    </label>
                    <input
                      type="text"
                      className="border border-black rounded-[6px] bg-white h-[45px]"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label>
                      Company:
                    </label>
                    <input
                      type="text"
                      className="border border-black rounded-[6px] bg-white h-[45px]"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label>
                      Card Number:
                    </label>
                    <input
                      type="text"
                      className="border border-black rounded-[6px] bg-white h-[45px]"
                    />
                </div>

                <div className="flex gap-4 justify-center w-full h-fit">
                  <button
                    type="button"
                    className="border rounded-[10px] px-8 py-4 bg-transparent dark:border-gray-700 border-gray-200"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="border  rounded-[10px] text-white px-8 py-4 bg-transparent dark:border-gray-700 border-gray-200 dark:bg-gray-700 bg-gray-200"
                  >
                    Save
                  </button>

                </div>
              </div>
                 
            </div>
      </div>
      )} */}
    </main>

  );
}
