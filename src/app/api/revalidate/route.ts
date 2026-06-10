import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Validate webhook secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
    }

    const body = await request.json();
    // Sanity webhook payload usually contains the document slug
    const slug = body?.slug?.current || body?.slug || "";

    if (slug) {
      // Revalidate standard path and localized paths
      revalidatePath(`/[locale]/${slug}`, "page");
      revalidatePath(`/[locale]/[city]/${slug}`, "page");
    } else {
      // Revalidate homepage
      revalidatePath("/[locale]", "page");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("Revalidation API error:", error);
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
