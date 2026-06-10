import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Validate request body using Zod
const ContactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  city: z.string(),
  service: z.string(),
  area: z.number().positive(),
  totalPrice: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    // 1. Rate limiting via Upstash (fallback if env vars not provided)
    let isAllowed = true;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Ratelimit } = await import("@upstash/ratelimit");
        const { Redis } = await import("@upstash/redis");
        const ratelimit = new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 requests per 10 minutes
        });
        const { success } = await ratelimit.limit(ip);
        isAllowed = success;
      } catch (err) {
        console.error("Rate limiting error:", err);
      }
    }

    if (!isAllowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 2. Parse request body
    const body = await request.json();
    const result = ContactSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, phone, city, service, area, totalPrice } = result.data;

    // 3. Save lead to PostgreSQL (via db helper)
    await db.lead.create({
      data: { name, phone, city, service, area, totalPrice },
    });

    // 4. Send Telegram message if token and chat ID are available
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const tgText = `🔔 *Нова заявка NOVA STELYA*\n\n👤 *Ім'я:* ${name}\n📞 *Телефон:* ${phone}\n📍 *Місто:* ${city}\n🏠 *Послуга:* ${service}\n📐 *Площа:* ${area} м²\n💰 *Вартість:* ${totalPrice} грн`;
      
      const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: tgText,
          parse_mode: "Markdown",
        }),
      });
    } else {
      console.log("[Telegram Mock Log] New Lead Submission:", {
        name,
        phone,
        city,
        service,
        area,
        totalPrice,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
