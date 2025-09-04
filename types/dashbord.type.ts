export type UserRole = "DOCTOR" | "PATIENT";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photoUrl?: string;
}

export interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
}

export type UserProfile = {
  id: string;
  name?: string;
  email: string;
  role: "PATIENT" | "DOCTOR";
  photo_url?: string | null;
  specialization?: string | null;
  createdAt?: string;
};