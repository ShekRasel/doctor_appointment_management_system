"use client";

import { api } from "@/helpers/helper";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { LoginForm, loginSchema } from "@/schemas/auth.schema";

export default function LoginPage() {
  const { setRole } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await api.post(`/auth/login`, data);
    },
    onSuccess: (res) => {
      console.log("Backend response:", res.data);
      alert("Login successful");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    setRole(data.role); // save role globally
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 md:px-8 text-gray-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-3 md:p-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4 tracking-tight">
          Sign in to Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              {...register("password")}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Role</label>
            <select
              {...register("role")}
              defaultValue=""
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.role.message}
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-xs mt-0.5 text-center">{error}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 text-xs bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition mt-2 cursor-pointer"
          >
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Don’t have an account?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              <Link href={"/register"}>Register</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
