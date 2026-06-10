import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const PAGES_DIR = path.join(process.cwd(), "src/seo/content/pages");

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  if (!token) return false;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const payload = await verifyToken(token, adminPassword);
  return !!payload;
}

// Ensure the directory exists
async function ensureDirectory() {
  try {
    await fs.mkdir(PAGES_DIR, { recursive: true });
  } catch (e) {
    // Ignore if exists
  }
}

export async function GET(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    if (!page) {
      return NextResponse.json({ error: "Missing page parameter" }, { status: 400 });
    }

    const cleanPage = page.replace(/[^a-zA-Z0-9-_]/g, ""); // prevent path traversal
    const filePath = path.join(PAGES_DIR, `${cleanPage}.json`);

    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      return NextResponse.json(JSON.parse(fileData));
    } catch (e) {
      // Return empty blocks indicating fallback should be used
      return NextResponse.json({ blocks: [] });
    }
  } catch (e) {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page, blocks } = await request.json();
    if (!page || !Array.isArray(blocks)) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const cleanPage = page.replace(/[^a-zA-Z0-9-_]/g, "");
    const filePath = path.join(PAGES_DIR, `${cleanPage}.json`);

    if (blocks.length === 0) {
      // Revert to pure code template by deleting JSON config
      try {
        await fs.unlink(filePath);
      } catch (e) {
        // Ignore if file already didn't exist
      }
      return NextResponse.json({ success: true, reverted: true, blocks: [] });
    } else {
      await ensureDirectory();
      await fs.writeFile(filePath, JSON.stringify({ blocks }, null, 2), "utf-8");
      return NextResponse.json({ success: true, blocks });
    }
  } catch (e) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
