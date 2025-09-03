import { DoctorForm, PatientForm } from "@/schemas/auth.schema";

export interface RegisterPatient {
  name: string;
  email: string;
  password: string;
  photo_url?: string;
}

export interface RegisterDoctor {
  name: string;
  email: string;
  password: string;
  specialization: string;
  photo_url?: string;
}

export type RegisterForm = DoctorForm | PatientForm;

export interface LoginForm {
  email: string;
  password: string;
  role: string;
}

// User structure
interface User {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR";
  photo_url: string | null;
  specialization: string | null;
}

// Data wrapper
interface LoginResponseData {
  user: User;
  token: string;
}

//Full backend response
export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoginResponseData;
}

//resgistration res
interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR";
  photo_url: string | null;
  specialization: string | null;
  createdAt: string;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RegisteredUser;
}

