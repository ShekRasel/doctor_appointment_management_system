"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaCalendarAlt,
  FaStethoscope,
  FaHome,

} from "react-icons/fa";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiUser } from "react-icons/fi";

interface LinkItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: "DOCTOR" | "PATIENT";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();

  const links: LinkItem[] =
    role === "DOCTOR"
      ? [
          {
            name: "Appointments",
            href: "/dashboard/doctor/appointments",
            icon: <FaCalendarAlt />,
          },
           {
            name: "profile",
            href: "/dashboard/doctor/profile",
            icon: <FiUser />,
          },
        ]
      : [
          {
            name: "Doctor List",
            href: "/dashboard/patient/doctorslist",
            icon: <FaStethoscope />,
          },
          {
            name: "My Appointments",
            href: "/dashboard/patient/appointments",
            icon: <FaCalendarAlt />,
          },
          {
            name: "profile",
            href: "/dashboard/patient/profile",
            icon: <FiUser />,
          },
        ];

  return (
    <div className="bg-gray-100 rounded-md shadow-md p-2 lg:p-5 w-16 lg:w-52 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start gap-2 pb-4">
        <Image
          src={"/logo.webp"}
          width={36}
          height={36}
          className="rounded-full"
          alt="logo"
        />
        <h1 className="hidden lg:block font-bold italic">Medicare</h1>
      </div>

      {/* Menu Items */}
      <div className="mt-4 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 p-2 rounded-md transition-colors duration-200
                ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-50"}
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="hidden lg:block font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
