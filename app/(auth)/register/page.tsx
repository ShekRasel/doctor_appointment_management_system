"use client";

import { api } from "@/helpers/client.helper";
import {
  DoctorForm,
  doctorRegisterSchema,
  patientRegisterSchema,
} from "@/schemas/auth.schema";
import { useAuthStore } from "@/stores/auth.store";
import { RegisterForm, RegisterResponse } from "@/types/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { FieldErrors, useForm } from "react-hook-form";
import specializations from "@/data/specializations.json";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const { role, setRole } = useAuthStore();
  const router = useRouter();
  // Pick schema based on role
  const schema =
    role === "DOCTOR" ? doctorRegisterSchema : patientRegisterSchema;

 const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegisterForm>({
  resolver: zodResolver(role === "DOCTOR" ? doctorRegisterSchema : patientRegisterSchema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
    photo_url: "",
    specialization: role === "DOCTOR" ? "" : undefined,
  },
});

// Mutation
const mutation = useMutation({
  mutationFn: async (data: RegisterForm & { selectedRole: "PATIENT" | "DOCTOR" }) => {
    return api.post<RegisterResponse>(
      `/auth/register/${data.selectedRole.toLowerCase()}`,
      data
    );
  },

  onSuccess: (res: AxiosResponse<RegisterResponse>) => {
    toast.success(res.data.message);
    console.log(res.data)
    router.push("/login");
  },

  onError: (err: unknown) => {
    if (err instanceof AxiosError) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } else {
      toast.error("Unexpected error occurred");
    }
  },
});

// Submit handler
const onSubmit = (data: RegisterForm) => {
  // Pass role explicitly when submitting
  mutation.mutate({ ...data, selectedRole: role as "PATIENT" | "DOCTOR" });
};


  // default role
  useEffect(() => {
    if (!role) {
      setRole("PATIENT");
    }
  }, [role, setRole]);

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
              role === "PATIENT"
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100"
            } transition`}
            onClick={() => setRole("PATIENT")}
          >
            Patient
          </button>
          <button
            className={`flex-1 py-1 font-medium cursor-pointer ${
              role === "DOCTOR"
                ? "bg-blue-600 text-white"
                : "bg-white  hover:bg-gray-100"
            } transition`}
            onClick={() => setRole("DOCTOR")}
          >
            Doctor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="flex justify-between gap-2">
            <div className="w-full">
              <label className="block text-xs font-medium mb-1">Name</label>
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
              <label className="block text-xs font-medium mb-1">Email</label>
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

          {/* Doctor-only field */}
          {role === "DOCTOR" && (
            <div>
              <label className="block text-xs font-medium mb-1">
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
              type="text"
              placeholder="https://example.com/photo.jpg"
              {...register("photo_url")}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md"
            />
            {errors.photo_url && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.photo_url.message as string}
              </p>
            )}
          </div>

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
