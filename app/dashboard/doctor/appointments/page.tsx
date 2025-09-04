"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/helpers/client.helper";
import { toast } from "react-hot-toast";
import Image from "next/image";

type Patient = {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
};

type Appointment = {
  id: string;
  patient: Patient;
  date: string;
  status: string;
};

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/appointments/doctor", {
        params: {
          status: statusFilter || undefined,
          date: dateFilter || undefined,
          page,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data?.data || []);
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
  }, [statusFilter, dateFilter, page]);

  const updateStatus = async (
    appointmentId: string,
    status: "COMPLETE" | "CANCELLED"
  ) => {
    const confirmMsg = `Are you sure you want to mark this appointment as ${status}?`;
    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in!");

    try {
      setUpdatingId(appointmentId);
      await api.patch(
        "/appointments/update-status",
        { appointment_id: appointmentId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Realtime UI update
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status } : a))
      );
      toast.success(`Appointment marked as ${status}`);
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-xl font-bold mb-4">My Appointments</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETE">Complete</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-200 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Appointments List */}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appointments.map((a) => (
            <li
              key={a.id}
              className=" bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={a.patient.photo_url || "/avatar2.png"}
                  width={50}
                  height={50}
                  alt={a.patient.name}
                  className="rounded-full object-cover"
                />

                <div className="space-y-1">
                  <h2 className="font-semibold text-blue-500">
                    {a.patient.name}
                  </h2>
                  <p className="text-sm text-gray-500">{a.patient.email}</p>
                  <p className="text-sm">
                    📅 {new Date(a.date).toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      a.status === "PENDING"
                        ? "text-yellow-600"
                        : a.status === "COMPLETE"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {a.status}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {a.status === "PENDING" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateStatus(a.id, "COMPLETE")}
                    disabled={updatingId === a.id}
                    className="flex-1 bg-green-600 text-white py-1 rounded-md hover:bg-green-700 transition cursor-pointer disabled:opacity-50"
                  >
                    {updatingId === a.id ? "Updating..." : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => updateStatus(a.id, "CANCELLED")}
                    disabled={updatingId === a.id}
                    className="flex-1 bg-red-600 text-white py-1 rounded-md hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
                  >
                    {updatingId === a.id ? "Updating..." : "Cancel"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-6 items-center justify-center">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
