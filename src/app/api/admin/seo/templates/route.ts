import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const TEMPLATE_OVERRIDES_FILE = path.join(process.cwd(), "src/seo/content/template-overrides.json");

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
    const data = await fs.readFile(TEMPLATE_OVERRIDES_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, locale, title, description } = await request.json();
    if (!key || !locale) {
      return NextResponse.json({ error: "Missing key or locale" }, { status: 400 });
    }

    let overrides: Record<string, Record<string, { title?: string; description?: string }>> = {};
    try {
      const fileData = await fs.readFile(TEMPLATE_OVERRIDES_FILE, "utf-8");
      overrides = JSON.parse(fileData);
    } catch (e) {
      // File might not exist or be empty
    }

    if (!overrides[key]) {
      overrides[key] = {};
    }

    if (!title && !description) {
      // Delete localed templates if both are empty
      delete overrides[key][locale];
      if (Object.keys(overrides[key]).length === 0) {
        delete overrides[key];
      }
    } else {
      overrides[key][locale] = {
        title: title || "",
        description: description || "",
      };
    }

    await fs.writeFile(TEMPLATE_OVERRIDES_FILE, JSON.stringify(overrides, null, 2), "utf-8");
    return NextResponse.json({ success: true, overrides });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save template overrides" }, { status: 500 });
  }
}
