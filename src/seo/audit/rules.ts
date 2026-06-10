export type AuditResult = {
  status: "OK" | "WARNING" | "ERROR";
  score: number; // 0 to 100
  issues: string[];
  keywordDensity: Record<string, number>;
};

const STOP_WORDS = new Set([
  "в", "у", "и", "і", "на", "для", "з", "с", "та", "по", "об", "за", "від", "под", "як", "как",
  "що", "что", "це", "это", "тут", "здесь", "про", "о", "а", "но", "але", "же", "ж", "також", "также"
]);

/**
 * Tokenizes text and calculates density of words (excluding stop words)
 */
export function calculateKeywordDensity(text: string): Record<string, number> {
  const words = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const totalWords = words.length;
  if (totalWords === 0) return {};

  const counts: Record<string, number> = {};
  for (const w of words) {
    counts[w] = (counts[w] || 0) + 1;
  }

  // Convert to percentages
  const density: Record<string, number> = {};
  for (const [word, count] of Object.entries(counts)) {
    density[word] = Math.round((count / totalWords) * 100);
  }

  return density;
}

/**
 * Performs deep semantic, density, and structure SEO audit on page metadata
 */
export function runDeepSeoAudit(params: {
  title: string;
  description: string;
  h1?: string;
  schema?: any;
}): AuditResult {
  const issues: string[] = [];
  let score = 100;
  let status: "OK" | "WARNING" | "ERROR" = "OK";

  const { title, description, h1, schema } = params;

  // 1. Title Audit
  if (!title) {
    status = "ERROR";
    issues.push("Критично: Title повністю відсутній.");
    score -= 40;
  } else {
    const titleLen = title.length;
    if (titleLen > 60) {
      status = "WARNING";
      issues.push(`Title занадто довгий (${titleLen}/60 симв.). Рекомендується скоротити.`);
      score -= 10;
    } else if (titleLen < 30) {
      status = "WARNING";
      issues.push(`Title занадто короткий (${titleLen}/30 симв.). Додайте ключові слова.`);
      score -= 10;
    }

    if (title.endsWith(".")) {
      status = "WARNING";
      issues.push("Title закінчується крапкою. Крапки в кінці Title шкодять CTR у видачі.");
      score -= 5;
    }
  }

  // 2. Description Audit
  if (!description) {
    status = "ERROR";
    issues.push("Критично: Description повністю відсутній.");
    score -= 40;
  } else {
    const descLen = description.length;
    if (descLen > 160) {
      status = "WARNING";
      issues.push(`Description занадто довгий (${descLen}/160 симв.). Буде обрізаний у видачі.`);
      score -= 10;
    } else if (descLen < 110) {
      status = "WARNING";
      issues.push(`Description занадто короткий (${descLen}/110 симв.). Додайте УТП.`);
      score -= 10;
    }

    // Check for CTA (Call to Action)
    const ctaKeywords = [
      "ціни", "замов", "дзвон", "викл", "обрат", "акці", "зниж", "гар", "купи",
      "цены", "заказ", "звон", "вызв", "выбр", "акци", "скид", "гар", "купи"
    ];
    const hasCta = ctaKeywords.some((keyword) => description.toLowerCase().includes(keyword));
    if (!hasCta) {
      status = "WARNING";
      issues.push("Description не містить заклику до дії (CTA) або комерційних слів (замовити, ціни, знижки тощо).");
      score -= 10;
    }
  }

  // 3. Keyword Density & Spam Audit
  const combinedText = `${title} ${description} ${h1 || ""}`;
  const density = calculateKeywordDensity(combinedText);
  
  // Find repeated keywords in Title and Description
  const titleWords = title.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const titleWordCounts: Record<string, number> = {};
  for (const w of titleWords) {
    titleWordCounts[w] = (titleWordCounts[w] || 0) + 1;
    if (titleWordCounts[w] > 2) {
      status = "WARNING";
      issues.push(`Можливий спам: Слово "${w}" повторюється в Title більше 2 разів.`);
      score -= 10;
    }
  }

  const spamWords = Object.entries(density)
    .filter(([_, pct]) => pct > 35)
    .map(([word]) => word);

  if (spamWords.length > 0) {
    status = "WARNING";
    issues.push(`Висока концентрація слів (переспам): [${spamWords.join(", ")}]. Спробуйте розбавити текст.`);
    score -= 15;
  }

  // 4. H1 Audit (if provided)
  if (h1) {
    const h1Len = h1.length;
    if (h1Len < 10) {
      status = "WARNING";
      issues.push(`Заголовок H1 занадто короткий (${h1Len} симв.).`);
      score -= 5;
    }
    // H1 shouldn't match Title 100%
    if (title && h1.toLowerCase() === title.toLowerCase()) {
      status = "WARNING";
      issues.push("Title і H1 повністю дублюють один одного. Урізноманітніть їх.");
      score -= 5;
    }
  }

  // 5. Schema.org validation
  if (!schema || (Array.isArray(schema) && schema.length === 0)) {
    status = "WARNING";
    issues.push("Відсутня мікророзметка Schema.org JSON-LD на сторінці.");
    score -= 10;
  }

  // Double check score limits
  score = Math.max(0, score);
  if (score < 50 && status === "OK") {
    status = "WARNING";
  }
  if (score < 30) {
    status = "ERROR";
  }

  return {
    status,
    score,
    issues: issues.length > 0 ? issues : ["Зауважень немає. Метадані оптимізовані відмінно!"],
    keywordDensity: density,
  };
}
