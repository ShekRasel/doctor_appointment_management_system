import { z } from "zod";

export const patientRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export const doctorRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  photo_url: z.string().url().optional().or(z.literal("")),
});

export type PatientForm = z.infer<typeof patientRegisterSchema>;
export type DoctorForm = z.infer<typeof doctorRegisterSchema>;

// Login schema validation
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor"]).refine((val) => val !== undefined, {
    message: "Please select a role",
  }),
});

export type LoginForm = z.infer<typeof loginSchema>;
