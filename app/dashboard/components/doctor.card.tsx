"use client";

import React, { useState } from "react";
import { Doctor } from "@/types/auth.type";
import { api } from "@/helpers/client.helper";
import { toast } from "react-hot-toast";
import axios from "axios";

interface Props {
  doctor: Doctor;
}

const DoctorCard: React.FC<Props> = ({ doctor }) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!date) {
        toast.error("Please select a date");
        return;
      }

      if (!token) {
        toast.error("You are not logged in!");
        return;
      }

      try {
        setLoading(true);
        await api.post(
          "/appointments",
          { doctorId: doctor.id, date },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Appointment booked successfully!");
        setDate("");
        setShowDatePicker(false); 
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to book appointment");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col gap-2">
      {/* preventing url error using img instead of next image */}
      <img
        src={doctor.photo_url || "/avatar2.png"}
        alt={doctor.name}
        className="rounded-full object-cover mx-auto h-24 w-24 shadow-md"
      />
      <h2 className="text-center font-semibold">{doctor.name}</h2>
      <p className="text-center text-sm text-gray-500">
        {doctor.specialization}
      </p>

      {showDatePicker ? (
        <>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm mt-2 cursor-pointer"
          />

          <button
            onClick={handleBook}
            disabled={loading}
            className="mt-2 w-full cursor-pointer bg-green-600 text-white py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>

          <button
            onClick={() => setShowDatePicker(false)}
            className="mt-1 cursor-pointer w-full bg-gray-300 text-gray-700 py-1 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowDatePicker(true)}
          className="mt-2 w-full bg-blue-600 cursor-pointer text-white py-1 md:py-2 rounded hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      )}
    </div>
  );
};

export default DoctorCard;
