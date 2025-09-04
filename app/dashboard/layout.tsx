import React from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import { getUserRoleServer } from "@/helpers/server.helper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRoleServer();
  return (
    <div className="flex gap-2 h-screen overflow-hidden bg-white text-gray-800 text-xs md:text-sm p-2">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {/* Navbar fixed */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-2 lg:p-4 text-xs bg-gray-100 rounded-md">
          {children}
        </main>
      </div>
    </div>
  );
}
