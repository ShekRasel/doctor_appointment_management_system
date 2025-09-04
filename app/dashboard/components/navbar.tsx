"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import Link from "next/link";
import { Searching } from "./search.input";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MdDashboardCustomize } from "react-icons/md";

const Navbar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearAuth();
    Cookies.remove("token");
    router.push("/login");
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="bg-gray-100 p-2 rounded-md relative lg:px-4">
      <div className="flex justify-between items-center">
        <span className="hidden lg:block text-green-600">
          <MdDashboardCustomize size={22} />
        </span>

        {/* searching */}
        <Searching />

        {/* profile section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 text-black cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            <Image
              src={user?.photo_url || "/avatar.png"}
              alt="profile"
              width={32}
              height={32}
              className="w-10 h-10 rounded-full object-cover p-1 bg-white shadow-md"
            />
          </button>

          {open && (
            <div className="absolute right-0 top-14 rounded-lg shadow-xl bg-white text-center w-40 md:w-56 overflow-hidden z-50">
              <Link href={"/dashboard/patient/profile"}>
                <div className="p-3 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-start gap-2">
                  <FiUser className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Profile
                  </span>
                </div>
              </Link>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={handleLogout}
                className="p-3 hover:bg-red-50 transition-colors duration-200 w-full flex items-center justify-start gap-2 text-sm font-medium text-gray-700"
              >
                <FiLogOut className="w-4 h-4 text-red-500" />
                <span className="cursor-pointer">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
