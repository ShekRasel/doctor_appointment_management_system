"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "@/types/auth.type";
import { UserProfile } from "@/types/dashbord.type";
import { useAuthStore } from "@/stores/auth.store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: MyJwtPayload = jwtDecode(token);

        // Build profile from decoded token only
        const profile: UserProfile = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };

        setUser(profile);
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return <p className="p-4">Loading profile...</p>;
  }

  const handleLogout = () => {
    clearAuth();
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex flex-col items-center">
        <Image
          src={user.photo_url || "/avatar.png"}
          width={100}
          height={100}
          className="rounded-full object-cover"
          alt={"profile"}
        />
        <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
        <p className="text-sm text-blue-500 font-bold">{user.role}</p>
      </div>

      <div className="space-y-2">
        <p className="text-center text-green-400">
          <span >Email:</span> {user.email}
        </p>
        {user.specialization && (
          <p>
            <span className="font-medium">Specialization:</span>{" "}
            {user.specialization}
          </p>
        )}
        {user.createdAt && (
          <p>
            <span className="font-medium">Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        className="w-full bg-red-400 cursor-pointer text-white py-2 rounded-md hover:bg-red-500 transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
