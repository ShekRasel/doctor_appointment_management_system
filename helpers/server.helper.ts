import { UserRole } from "@/types/dashbord.type";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { MyJwtPayload } from "@/types/auth.type";

// fetch token & decode role
export const getUserRoleServer = async (): Promise<UserRole> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  try {
    const decoded: MyJwtPayload = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error("Invalid token:", error);
    redirect("/login");
  }
};
