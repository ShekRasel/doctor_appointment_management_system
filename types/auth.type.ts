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
