import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import AdminClient from "./AdminClient";
import LoginForm from "./LoginForm";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const isDefaultPassword = process.env.ADMIN_PASSWORD === undefined || process.env.ADMIN_PASSWORD === "admin123";
  
  let isAuthenticated = false;

  if (token) {
    const payload = await verifyToken(token, adminPassword);
    if (payload && payload.user === "admin") {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminClient isDefaultPassword={isDefaultPassword} />;
}
