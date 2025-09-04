"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/helpers/client.helper";
import { toast } from "react-hot-toast";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  photo_url: string | null;
};

type Appointment = {
  id: string;
  doctor: Doctor;
  date: string;
  status: string;
};

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/appointments/patient", {
        params: { status: status || undefined, page },
        headers: { Authorization: `Bearer ${token}` },
      });

      const appts = res.data?.data || [];
      setAppointments(appts);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [status, page]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 border rounded-sm border-gray-300 shadow mb-4 cursor-pointer"
      >
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {/* Appointments List */}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appointments.map((a) => {
            let statusClasses = "";
            switch (a.status) {
              case "PENDING":
                statusClasses = "bg-yellow-100 text-yellow-800";
                break;
              case "COMPLETED":
                statusClasses = "bg-green-100 text-green-800";
                break;
              case "CANCELLED":
                statusClasses = "bg-red-100 text-red-800";
                break;
              default:
                statusClasses = "bg-gray-100 text-gray-800";
            }

            return (
              <li key={a.id} className="p-4 rounded shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={a.doctor.photo_url || "/avatar2.png"}
                    alt={a.doctor.name}
                    className="rounded-full object-cover h-14 w-14"
                  />
                  <h2 className="text-blue-600 font-bold">{a.doctor.name}</h2>
                  <p className="text-sm text-gray-500">{a.doctor.specialization}</p>
                  <p>Date: {new Date(a.date).toLocaleString()}</p>
                  <span
                    className={`px-3 py-1 rounded-md font-semibold ${statusClasses}`}
                  >
                    {a.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-4 items-center justify-center">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientAppointmentsPage;
