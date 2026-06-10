import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-session")?.value;
  if (!token) return false;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const payload = await verifyToken(token, adminPassword);
  return !!payload;
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { pageType, locale, city, title, description } = await request.json();

    // Mock responses from different AI models representing the architectural foundation
    const claudeRecommendation = `[Claude 3.5 Sonnet]: Заголовок для сторінки "${pageType}" містить важливі гео-модифікатори (${city || "Національний"}). Опис (Description) добре збалансований, проте рекомендується додати чіткіший призыв до дії (CTA) наприкінці, наприклад "Дзвоніть!".`;
    
    const gptRecommendation = `[GPT-4o]: Структура мікророзмітки відповідає стандартам. Для сторінки типу "${pageType}" рекомендується переконатися, що ключове слово стоїть у перших 20 символах Title. Спам-індекс у нормі.`;
    
    const geminiRecommendation = `[Gemini 1.5 Pro]: Аналіз мобільної видачі показує гарну читабельність сниппета. Бажано додати LSI-слова (наприклад, "монтаж", "виробник", "гарантія") для кращого охоплення семантичного ядра.`;

    const synthesizedRecommendation = `[Золота середина (Синтез)]: Загальна оцінка оптимізації: 92/100. Рекомендується: 1) Скоротити Title на 3 символи; 2) Замінити загальну фразу в Description на активний призыв "Замовляйте монтаж за 1 день!"; 3) Перевірити наявність Schema-розмітки BreadcrumbList.`;

    return NextResponse.json({
      success: true,
      analyses: [
        { model: "Claude 3.5 Sonnet", type: "Expert Copywriter", content: claudeRecommendation },
        { model: "GPT-4o", type: "Technical SEO Auditor", content: gptRecommendation },
        { model: "Gemini 1.5 Pro", type: "UX & Mobile SERP Expert", content: geminiRecommendation },
      ],
      synthesis: synthesizedRecommendation,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to run AI analysis" },
      { status: 500 }
    );
  }
}
