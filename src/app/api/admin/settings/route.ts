import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "src/config/settings.json");

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  if (!token) return false;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const payload = await verifyToken(token, adminPassword);
  return !!payload;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({ error: "Failed to read settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newSettings = await request.json();
    
    // Basic validation
    if (!newSettings.theme || !newSettings.contacts) {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
    }

    await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), "utf-8");
    return NextResponse.json({ success: true, settings: newSettings });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
