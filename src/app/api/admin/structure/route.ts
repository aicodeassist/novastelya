import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const CITIES_FILE = path.join(process.cwd(), "src/config/cities.json");
const SERVICES_FILE = path.join(process.cwd(), "src/config/services.json");

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
    const citiesData = await fs.readFile(CITIES_FILE, "utf-8");
    const servicesData = await fs.readFile(SERVICES_FILE, "utf-8");
    return NextResponse.json({
      cities: JSON.parse(citiesData),
      services: JSON.parse(servicesData),
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to read structure configurations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { type, data } = await request.json();
    if (!type || !data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    if (type === "cities") {
      // Basic validation
      for (const city of data) {
        if (!city.slug || !city.uk || !city.ru || !city.phone || !city.address) {
          return NextResponse.json({ error: "Invalid city properties" }, { status: 400 });
        }
      }
      await fs.writeFile(CITIES_FILE, JSON.stringify(data, null, 2), "utf-8");
      return NextResponse.json({ success: true, cities: data });
    }

    if (type === "services") {
      // Basic validation
      for (const service of data) {
        if (!service.slug || !service.category || !service.uk?.title || !service.ru?.title) {
          return NextResponse.json({ error: "Invalid service properties" }, { status: 400 });
        }
      }
      await fs.writeFile(SERVICES_FILE, JSON.stringify(data, null, 2), "utf-8");
      return NextResponse.json({ success: true, services: data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save structure config" }, { status: 500 });
  }
}
