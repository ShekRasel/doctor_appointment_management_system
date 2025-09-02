"use client";

import { api } from "@/helpers/helper";
import {
  DoctorForm,
  doctorRegisterSchema,
  patientRegisterSchema,
} from "@/schemas/auth.schema";
import { useAuthStore } from "@/stores/auth.store";
import {
  RegisterDoctor,
  RegisterForm,
  RegisterPatient,
} from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import specializations from "@/data/specializations.json";
import Link from "next/link";

export default function RegisterPage() {
  const { role, setRole } = useAuthStore();
  const [error, setError] = useState("");

  const schema =
    role === "patient" ? patientRegisterSchema : doctorRegisterSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterPatient | RegisterDoctor) => {
      return await api.post(`/auth/register/${role}`, data);
    },
    onSuccess: (res) => {
      console.log(res.data);
      alert("Registration successful");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Unexpected error occurred");
      }
    },
  });

  const onSubmit = (data: RegisterForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 md:px-8 text-gray-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-3 md:p-4">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4 tracking-tight">
          Create Your Account
        </h2>

        {/* Role Tabs */}
        <div className="flex rounded-sm overflow-hidden mb-4 shadow-sm text-xs">
          <button
            className={`flex-1 py-1 font-medium cursor-pointer ${
              role === "patient"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            } transition`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`flex-1 py-1 font-medium cursor-pointer ${
              role === "doctor"
                ? "bg-blue-600 text-white"
                : "bg-white  hover:bg-gray-100"
            } transition`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        {/* registration form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <label className="block  text-xs font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.name.message as string}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block  text-xs font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.email.message as string}
                </p>
              )}
            </div>
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
                {errors.password.message as string}
              </p>
            )}
          </div>

          {role === "doctor" && (
            <div>
              <label className="block  text-xs font-medium mb-1">
                Specialization
              </label>
              <select
                {...register("specialization")}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Specialization
                </option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors && "specialization" in errors && (
                <p className="text-red-500 text-xs mt-0.5">
                  {(errors as FieldErrors<DoctorForm>).specialization?.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1">
              Photo URL (optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              {...register("photo_url", {
                required: false, 
                validate: (value) => {
                  if (!value) return true;
                  try {
                    new URL(value);
                    return true;
                  } catch {
                    return "Must be a valid URL";
                  }
                },
              })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-0.5 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full py-2 text-xs bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition mt-2 cursor-pointer"
          >
            {mutation.isPending ? "Registering..." : "Register"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Already have an account?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              <Link href={"/login"}>Sign in</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
