"use client";

import React, { useState, useEffect } from "react";
import { activeCities } from "@/config/geo-matrix";
import { services } from "@/config/services.config";
import { runDeepSeoAudit } from "@/seo/audit/rules";
import styles from "./page.module.css";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

type Props = {
  isDefaultPassword?: boolean;
};

export default function AdminClient({ isDefaultPassword = false }: Props) {
  const currentLocale = "uk";

  const [activeTab, setActiveTab] = useState<"dashboard" | "simulator" | "templates" | "audit" | "theme" | "contacts" | "structure" | "content">("dashboard");

  // General Settings
  const [themeColors, setThemeColors] = useState<Record<string, string>>({});
  const [themeFonts, setThemeFonts] = useState<Record<string, string>>({});
  const [themeRadius, setThemeRadius] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<any>({ socials: {} });

  // Dynamic Structure Lists
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  // New City Form State
  const [newCitySlug, setNewCitySlug] = useState("");
  const [newCityUk, setNewCityUk] = useState("");
  const [newCityRu, setNewCityRu] = useState("");
  const [newCityPhone, setNewCityPhone] = useState("");
  const [newCityAddress, setNewCityAddress] = useState("");
  const [newCityAddressRu, setNewCityAddressRu] = useState("");
  const [newCityRegion, setNewCityRegion] = useState("UA-30");
  const [newCityPriceMod, setNewCityPriceMod] = useState(1.0);
  const [newCityActive, setNewCityActive] = useState(true);
  const [newCityLat, setNewCityLat] = useState(50.45);
  const [newCityLon, setNewCityLon] = useState(30.52);
  const [newCityLandmarks, setNewCityLandmarks] = useState("");
  const [newCityHours, setNewCityHours] = useState("Пн-Сб 9:00-19:00");

  // Editing City Form State
  const [editingCitySlug, setEditingCitySlug] = useState<string | null>(null);
  const [editCitySlug, setEditCitySlug] = useState("");
  const [editCityUk, setEditCityUk] = useState("");
  const [editCityRu, setEditCityRu] = useState("");
  const [editCityPhone, setEditCityPhone] = useState("");
  const [editCityAddress, setEditCityAddress] = useState("");
  const [editCityAddressRu, setEditCityAddressRu] = useState("");
  const [editCityRegion, setEditCityRegion] = useState("UA-30");
  const [editCityPriceMod, setEditCityPriceMod] = useState(1.0);
  const [editCityActive, setEditCityActive] = useState(true);
  const [editCityLat, setEditCityLat] = useState(50.45);
  const [editCityLon, setEditCityLon] = useState(30.52);
  const [editCityLandmarks, setEditCityLandmarks] = useState("");
  const [editCityHours, setEditCityHours] = useState("Пн-Сб 9:00-19:00");

  // New Service Form State
  const [newSrvSlug, setNewSrvSlug] = useState("");
  const [newSrvCategory, setNewSrvCategory] = useState<"materials" | "designs" | "lighting" | "rooms">("rooms");
  const [newSrvPrice, setNewSrvPrice] = useState(250);
  const [newSrvUkTitle, setNewSrvUkTitle] = useState("");
  const [newSrvUkDesc, setNewSrvUkDesc] = useState("");
  const [newSrvUkH1, setNewSrvUkH1] = useState("");
  const [newSrvUkBread, setNewSrvUkBread] = useState("");
  const [newSrvRuTitle, setNewSrvRuTitle] = useState("");
  const [newSrvRuDesc, setNewSrvRuDesc] = useState("");
  const [newSrvRuH1, setNewSrvRuH1] = useState("");
  const [newSrvRuBread, setNewSrvRuBread] = useState("");

  // Editing Service Form State
  const [editingSrvSlug, setEditingSrvSlug] = useState<string | null>(null);
  const [editSrvSlug, setEditSrvSlug] = useState("");
  const [editSrvCategory, setEditSrvCategory] = useState<"materials" | "designs" | "lighting" | "rooms">("rooms");
  const [editSrvPrice, setEditSrvPrice] = useState(250);
  const [editSrvUkTitle, setEditSrvUkTitle] = useState("");
  const [editSrvUkDesc, setEditSrvUkDesc] = useState("");
  const [editSrvUkH1, setEditSrvUkH1] = useState("");
  const [editSrvUkBread, setEditSrvUkBread] = useState("");
  const [editSrvRuTitle, setEditSrvRuTitle] = useState("");
  const [editSrvRuDesc, setEditSrvRuDesc] = useState("");
  const [editSrvRuH1, setEditSrvRuH1] = useState("");
  const [editSrvRuBread, setEditSrvRuBread] = useState("");

  // Simulator State
  const [simLocale, setSimLocale] = useState<"uk" | "ru">(currentLocale);
  const [simCity, setSimCity] = useState<string>("kyiv");
  const [simPageType, setSimPageType] = useState<string>("home");
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");

  // Overrides Map loaded from API
  const [overridesMap, setOverridesMap] = useState<Record<string, { title?: string; description?: string }>>({});
  
  // Template Overrides Map loaded from API
  const [templateOverrides, setTemplateOverrides] = useState<Record<string, Record<string, { title?: string; description?: string }>>>({});
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("home");
  
  // Template edit fields
  const [templateTitleUk, setTemplateTitleUk] = useState<string>("");
  const [templateDescUk, setTemplateDescUk] = useState<string>("");
  const [templateTitleRu, setTemplateTitleRu] = useState<string>("");
  const [templateDescRu, setTemplateDescRu] = useState<string>("");
  
  // Form edit state
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavingTemplates, setIsSavingTemplates] = useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preview Metadata loaded from server
  const [metadataPreview, setMetadataPreview] = useState<{
    title: string;
    description: string;
    canonical: string;
    hreflangs: Record<string, string>;
    schema: any;
    h1Text: string;
  } | null>(null);

  // Real-time Audit results
  const [realtimeAudit, setRealtimeAudit] = useState<any>(null);

  // Bulk Audit State
  const [auditProgress, setAuditProgress] = useState<number>(0);
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [auditResults, setAuditResults] = useState<any[]>([]);
  const [auditSummary, setAuditSummary] = useState({ ok: 0, warn: 0, error: 0 });

  // Page Builder content state
  const [selectedPage, setSelectedPage] = useState<string>("matte-ceilings");
  const [pageBlocks, setPageBlocks] = useState<any[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSavingContent, setIsSavingContent] = useState<boolean>(false);
  const [builderLocale, setBuilderLocale] = useState<"uk" | "ru">("uk");
  const [builderCity, setBuilderCity] = useState<string>("");

  // Load blocks on page change or tab switch
  useEffect(() => {
    async function loadPageBlocks() {
      if (activeTab !== "content") return;
      try {
        const res = await fetch(`/api/admin/content?page=${selectedPage}`);
        if (res.ok) {
          const data = await res.json();
          setPageBlocks(data.blocks || []);
          if (data.blocks && data.blocks.length > 0) {
            setSelectedBlockId(data.blocks[0].id);
          } else {
            setSelectedBlockId(null);
          }
        }
      } catch (e) {
        console.error("Failed to load page blocks:", e);
      }
    }
    loadPageBlocks();
  }, [selectedPage, activeTab]);

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...pageBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setPageBlocks(newBlocks);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = pageBlocks.filter((b) => b.id !== id);
    setPageBlocks(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(newBlocks.length > 0 ? newBlocks[0].id : null);
    }
  };

  const addBlock = (type: string) => {
    const id = `block-${type.toLowerCase()}-${Date.now()}`;
    let newBlock: any = { id, type };
    if (type === "HeroBlock" || type === "HeroSection") {
      newBlock.uk = { title: "Нова натяжна стеля {cityPhrase}", subtitle: "Найкраща якість та монтаж за 1 день", btnText: "Замовити замір" };
      newBlock.ru = { title: "Новый натяжной потолок {cityPhrase}", subtitle: "Лучшее качество и монтаж за 1 день", btnText: "Заказать замер" };
    } else if (type === "BenefitsBlock" || type === "BenefitsSection") {
      newBlock.uk = { title: "Наші головні переваги" };
      newBlock.ru = { title: "Наши главные преимущества" };
      newBlock.benefits = [
        { icon: "💎", uk: { title: "Якість", description: "Преміальні матеріали" }, ru: { title: "Качество", description: "Премиальные материалы" } }
      ];
    } else if (type === "CtaBlock" || type === "CtaSection") {
      newBlock.uk = { title: "Отримайте прорахунок вартості", subtitle: "Зв'яжіться з нами для виклику замірника", btnText: "Зв'язатися" };
      newBlock.ru = { title: "Получите расчет стоимости", subtitle: "Свяжитесь с нами для вызова замерщика", btnText: "Связаться" };
    } else if (type === "FaqBlock" || type === "FaqSection") {
      newBlock.uk = { title: "FAQ" };
      newBlock.ru = { title: "FAQ" };
      newBlock.faqs = [
        { uk: { q: "Питання?", a: "Відповідь." }, ru: { q: "Вопрос?", a: "Ответ." } }
      ];
    } else if (type === "RichTextBlock" || type === "RichTextSection") {
      newBlock.uk = { content: "<h2>Заголовок секції</h2><p>Ваш текст...</p>" };
      newBlock.ru = { content: "<h2>Заголовок секции</h2><p>Ваш текст...</p>" };
    }

    setPageBlocks([...pageBlocks, newBlock]);
    setSelectedBlockId(id);
  };

  const handleSaveContent = async () => {
    setIsSavingContent(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: selectedPage, blocks: pageBlocks }),
      });
      if (res.ok) {
        showToast("Контент сторінки успішно опубліковано!");
      } else {
        showToast("Помилка збереження контенту.");
      }
    } catch (e) {
      showToast("Помилка з'єднання.");
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleRevertContent = async () => {
    if (confirm("Ви дійсно бажаєте скинути всі налаштування сторінки до стандартного коду? Всі кастомні блоки буде видалено!")) {
      setIsSavingContent(true);
      try {
        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: selectedPage, blocks: [] }),
        });
        if (res.ok) {
          setPageBlocks([]);
          setSelectedBlockId(null);
          showToast("Сторінку скинуто до стандартного коду!");
        } else {
          showToast("Помилка під час скидання сторінки.");
        }
      } catch (e) {
        showToast("Помилка підключення.");
      } finally {
        setIsSavingContent(false);
      }
    }
  };

  const updateBlockField = (blockId: string, lang: "uk" | "ru", fieldName: string, value: string) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const langContent = b[lang] || {};
        return {
          ...b,
          [lang]: {
            ...langContent,
            [fieldName]: value,
          },
        };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  const updateBenefitItem = (blockId: string, index: number, field: string, value: any, lang?: "uk" | "ru") => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const benefits = [...(b.benefits || [])];
        if (lang) {
          benefits[index] = {
            ...benefits[index],
            [lang]: {
              ...(benefits[index][lang] || {}),
              [field]: value,
            },
          };
        } else {
          benefits[index] = {
            ...benefits[index],
            [field]: value,
          };
        }
        return { ...b, benefits };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  const addBenefitItem = (blockId: string) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const benefits = [
          ...(b.benefits || []),
          {
            icon: "💎",
            uk: { title: "Нова перевага", description: "Опис..." },
            ru: { title: "Новое преимущество", description: "Описание..." },
          },
        ];
        return { ...b, benefits };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  const removeBenefitItem = (blockId: string, index: number) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const benefits = (b.benefits || []).filter((_: any, i: number) => i !== index);
        return { ...b, benefits };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  const updateFaqItem = (blockId: string, index: number, field: string, value: string, lang: "uk" | "ru") => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const faqs = [...(b.faqs || [])];
        faqs[index] = {
          ...faqs[index],
          [lang]: {
            ...(faqs[index][lang] || {}),
            [field]: value,
          },
        };
        return { ...b, faqs };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  const addFaqItem = (blockId: string) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const faqs = [
          ...(b.faqs || []),
          {
            uk: { q: "Нове питання?", a: "Відповідь..." },
            ru: { q: "Новый вопрос?", a: "Ответ..." },
          },
        ];
        return { ...b, faqs };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  const removeFaqItem = (blockId: string, index: number) => {
    const updated = pageBlocks.map((b) => {
      if (b.id === blockId) {
        const faqs = (b.faqs || []).filter((_: any, i: number) => i !== index);
        return { ...b, faqs };
      }
      return b;
    });
    setPageBlocks(updated);
  };

  // Load all configurations on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setThemeColors(data.theme.colors);
          setThemeFonts(data.theme.fonts);
          setThemeRadius(data.theme.radius);
          setContacts(data.contacts);
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }

    async function loadOverrides() {
      try {
        const res = await fetch("/api/admin/seo");
        if (res.ok) {
          const data = await res.json();
          setOverridesMap(data);
        }
      } catch (e) {
        console.error("Failed to load overrides:", e);
      }
    }

    async function loadTemplateOverrides() {
      try {
        const res = await fetch("/api/admin/seo/templates");
        if (res.ok) {
          const data = await res.json();
          setTemplateOverrides(data);
        }
      } catch (e) {
        console.error("Failed to load template overrides:", e);
      }
    }

    async function loadStructure() {
      try {
        const res = await fetch("/api/admin/structure");
        if (res.ok) {
          const data = await res.json();
          setCitiesList(data.cities);
          setServicesList(data.services);
        }
      } catch (e) {
        console.error("Failed to load structure list:", e);
      }
    }

    loadSettings();
    loadOverrides();
    loadTemplateOverrides();
    loadStructure();
  }, []);

  // Update simulator preview and inputs from server API
  useEffect(() => {
    async function updatePreview() {
      try {
        const res = await fetch(
          `/api/admin/seo/preview?page=${simPageType}&city=${simCity}&locale=${simLocale}`
        );
        if (res.ok) {
          const meta = await res.json();
          setMetadataPreview(meta);

          // Initialize edit fields with current overrides or template defaults
          const overrideKey = `${simLocale}-${simCity || "national"}-${simPageType}`;
          const pageOverride = overridesMap[overrideKey];
          setEditTitle(pageOverride?.title || meta.title || "");
          setEditDescription(pageOverride?.description || meta.description || "");
        }
      } catch (e) {
        console.error("Failed to load metadata preview:", e);
      }
    }

    updatePreview();
  }, [simLocale, simCity, simPageType, overridesMap, templateOverrides]);

  // Sync templates form when selected key or templates map changes
  useEffect(() => {
    const pageTpl = templateOverrides[selectedTemplateKey] || {};
    setTemplateTitleUk(pageTpl.uk?.title || "");
    setTemplateDescUk(pageTpl.uk?.description || "");
    setTemplateTitleRu(pageTpl.ru?.title || "");
    setTemplateDescRu(pageTpl.ru?.description || "");
  }, [selectedTemplateKey, templateOverrides]);

  // Run real-time audit when fields change
  useEffect(() => {
    if (metadataPreview) {
      const audit = runDeepSeoAudit({
        title: editTitle,
        description: editDescription,
        h1: metadataPreview.h1Text,
        schema: metadataPreview.schema,
      });
      setRealtimeAudit(audit);
    }
  }, [editTitle, editDescription, metadataPreview]);

  // Show Toast popups
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save SEO Overrides
  const handleSaveOverrides = async () => {
    setIsSaving(true);
    const key = `${simLocale}-${simCity || "national"}-${simPageType}`;
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          title: editTitle,
          description: editDescription,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOverridesMap(data.overrides);
        showToast("Метадані успішно збережено та активовано!");
      } else {
        showToast("Помилка збереження оверрайдів.");
      }
    } catch (e) {
      showToast("Помилка підключення до сервера.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete SEO Overrides (Restore template default)
  const handleDeleteOverride = async () => {
    setIsSaving(true);
    const key = `${simLocale}-${simCity || "national"}-${simPageType}`;
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          title: "",
          description: "",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOverridesMap(data.overrides);
        showToast("Оверрайд видалено, повернуто до шаблону!");
      } else {
        showToast("Помилка видалення оверрайду.");
      }
    } catch (e) {
      showToast("Помилка підключення до сервера.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save Template overrides
  const handleSaveTemplates = async (locale: "uk" | "ru") => {
    setIsSavingTemplates(true);
    const title = locale === "uk" ? templateTitleUk : templateTitleRu;
    const description = locale === "uk" ? templateDescUk : templateDescRu;
    try {
      const res = await fetch("/api/admin/seo/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: selectedTemplateKey,
          locale,
          title,
          description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTemplateOverrides(data.overrides);
        showToast(`Шаблон для [${locale.toUpperCase()}] збережено!`);
      } else {
        showToast("Помилка збереження шаблону.");
      }
    } catch (e) {
      showToast("Помилка підключення до сервера.");
    } finally {
      setIsSavingTemplates(false);
    }
  };

  // Save Theme & Contact Settings
  const handleSaveSettings = async (colorsObj = themeColors, fontsObj = themeFonts, radiusObj = themeRadius, contactsObj = contacts) => {
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          theme: {
            colors: colorsObj,
            fonts: fontsObj,
            radius: radiusObj
          },
          contacts: contactsObj
        }),
      });

      if (res.ok) {
        showToast("Налаштування успішно збережено!");
      } else {
        showToast("Помилка при збереженні налаштувань.");
      }
    } catch (e) {
      showToast("Помилка з'єднання з сервером.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Reset theme and contact options to defaults
  const handleResetSettings = () => {
    const defaults = {
      theme: {
        colors: {
          gold: "#BFA05D",
          goldHover: "#A88846",
          goldMuted: "rgba(191, 160, 93, 0.15)",
          bg: "#F9F9F9",
          bgSecondary: "#FFFFFF",
          surface: "#FFFFFF",
          surfaceHover: "#F9F9F9",
          border: "rgba(0, 0, 0, 0.08)",
          borderHover: "rgba(0, 0, 0, 0.16)",
          text: "#121212",
          textSecondary: "#666666",
          textMuted: "#999999"
        },
        fonts: {
          sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          serif: "'Syne', sans-serif"
        },
        radius: {
          xs: "4px",
          sm: "8px",
          md: "12px",
          lg: "24px",
          xl: "36px"
        }
      },
      contacts: {
        siteName: "NOVA STELYA",
        brand: "NOVA STELYA",
        url: "https://novastelya.com",
        phone: "0 800 000-000",
        email: "info@novastelya.com",
        foundingYear: 2015,
        socials: {
          instagram: "https://instagram.com/novastelya",
          facebook: "https://facebook.com/novastelya",
          telegram: "https://t.me/novastelya",
          viber: "viber://chat?number=%2B380000000000"
        }
      }
    };

    setThemeColors(defaults.theme.colors);
    setThemeFonts(defaults.theme.fonts);
    setThemeRadius(defaults.theme.radius);
    setContacts(defaults.contacts);

    handleSaveSettings(defaults.theme.colors, defaults.theme.fonts, defaults.theme.radius, defaults.contacts);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      window.location.reload();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Run Bulk Audit on Server
  const runBulkAudit = async () => {
    setAuditRunning(true);
    setAuditProgress(15);
    try {
      const res = await fetch("/api/admin/seo/audit");
      if (res.ok) {
        setAuditProgress(60);
        const data = await res.json();
        setAuditProgress(100);
        setAuditResults(data.results);
        setAuditSummary(data.summary);
      } else {
        showToast("Помилка під час аудиту.");
      }
    } catch (e) {
      showToast("Помилка підключення до сервера.");
    } finally {
      setAuditRunning(false);
    }
  };

  // Structure Save Helper
  const handleSaveStructure = async (type: "cities" | "services", updatedData: any[]) => {
    try {
      const res = await fetch("/api/admin/structure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, data: updatedData }),
      });
      if (res.ok) {
        showToast("Структуру сторінок успішно оновлено!");
        if (type === "cities") setCitiesList(updatedData);
        else setServicesList(updatedData);
      } else {
        const err = await res.json();
        showToast(`Помилка: ${err.error || "Не вдалося зберегти"}`);
      }
    } catch (e) {
      showToast("Помилка з'єднання з сервером.");
    }
  };

  // Add City
  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitySlug || !newCityUk || !newCityRu || !newCityPhone || !newCityAddress) {
      showToast("Заповніть обов'язкові поля міста!");
      return;
    }

    const cityObj = {
      slug: newCitySlug.toLowerCase().trim(),
      uk: newCityUk.trim(),
      ru: newCityRu.trim(),
      region: newCityRegion,
      active: newCityActive,
      phone: newCityPhone.trim(),
      address: newCityAddress.trim(),
      addressRu: newCityAddressRu.trim() || newCityAddress.trim(),
      coordinates: { lat: newCityLat, lon: newCityLon },
      priceModifier: newCityPriceMod,
      landmarks: newCityLandmarks ? newCityLandmarks.split(",").map(x => x.trim()) : [],
      officeHours: newCityHours
    };

    if (citiesList.some(c => c.slug === cityObj.slug)) {
      showToast("Місто з таким slug вже існує!");
      return;
    }

    const updated = [...citiesList, cityObj];
    handleSaveStructure("cities", updated);

    // Reset Form
    setNewCitySlug("");
    setNewCityUk("");
    setNewCityRu("");
    setNewCityPhone("");
    setNewCityAddress("");
    setNewCityAddressRu("");
    setNewCityPriceMod(1.0);
  };

  // Edit City trigger
  const startEditCity = (city: any) => {
    setEditingCitySlug(city.slug);
    setEditCitySlug(city.slug);
    setEditCityUk(city.uk);
    setEditCityRu(city.ru);
    setEditCityPhone(city.phone);
    setEditCityAddress(city.address);
    setEditCityAddressRu(city.addressRu || city.address);
    setEditCityRegion(city.region);
    setEditCityPriceMod(city.priceModifier);
    setEditCityActive(city.active);
    setEditCityLat(city.coordinates?.lat || 50.45);
    setEditCityLon(city.coordinates?.lon || 30.52);
    setEditCityLandmarks(city.landmarks?.join(", ") || "");
    setEditCityHours(city.officeHours || "Пн-Сб 9:00-19:00");
  };

  // Save Edit City
  const handleSaveEditCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCitySlug || !editCityUk || !editCityRu || !editCityPhone || !editCityAddress) {
      showToast("Заповніть обов'язкові поля міста!");
      return;
    }

    const updated = citiesList.map(city => {
      if (city.slug === editingCitySlug) {
        return {
          slug: editCitySlug.toLowerCase().trim(),
          uk: editCityUk.trim(),
          ru: editCityRu.trim(),
          region: editCityRegion,
          active: editCityActive,
          phone: editCityPhone.trim(),
          address: editCityAddress.trim(),
          addressRu: editCityAddressRu.trim() || editCityAddress.trim(),
          coordinates: { lat: editCityLat, lon: editCityLon },
          priceModifier: editCityPriceMod,
          landmarks: editCityLandmarks ? editCityLandmarks.split(",").map(x => x.trim()) : [],
          officeHours: editCityHours
        };
      }
      return city;
    });

    handleSaveStructure("cities", updated);
    setEditingCitySlug(null);
  };

  // Delete City
  const handleDeleteCity = (slug: string) => {
    if (confirm(`Ви дійсно бажаєте видалити місто [${slug}]? Всі зв'язані сторінки зникнуть з маршрутизації.`)) {
      const updated = citiesList.filter(c => c.slug !== slug);
      handleSaveStructure("cities", updated);
    }
  };

  // Add Service / Room
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvSlug || !newSrvUkTitle || !newSrvRuTitle) {
      showToast("Заповніть обов'язкові поля послуги!");
      return;
    }

    const srvObj = {
      slug: newSrvSlug.toLowerCase().trim(),
      category: newSrvCategory,
      basePrice: newSrvPrice,
      uk: {
        title: newSrvUkTitle.trim(),
        description: newSrvUkDesc.trim() || newSrvUkTitle.trim(),
        h1: newSrvUkH1.trim() || newSrvUkTitle.trim(),
        breadcrumb: newSrvUkBread.trim() || newSrvUkTitle.trim()
      },
      ru: {
        title: newSrvRuTitle.trim(),
        description: newSrvRuDesc.trim() || newSrvRuTitle.trim(),
        h1: newSrvRuH1.trim() || newSrvRuTitle.trim(),
        breadcrumb: newSrvRuBread.trim() || newSrvRuTitle.trim()
      }
    };

    if (servicesList.some(s => s.slug === srvObj.slug)) {
      showToast("Послуга з таким slug вже існує!");
      return;
    }

    const updated = [...servicesList, srvObj];
    handleSaveStructure("services", updated);

    // Reset Form
    setNewSrvSlug("");
    setNewSrvUkTitle("");
    setNewSrvUkDesc("");
    setNewSrvUkH1("");
    setNewSrvUkBread("");
    setNewSrvRuTitle("");
    setNewSrvRuDesc("");
    setNewSrvRuH1("");
    setNewSrvRuBread("");
  };

  // Edit Service trigger
  const startEditService = (srv: any) => {
    setEditingSrvSlug(srv.slug);
    setEditSrvSlug(srv.slug);
    setEditSrvCategory(srv.category);
    setEditSrvPrice(srv.basePrice);
    setEditSrvUkTitle(srv.uk?.title || "");
    setEditSrvUkDesc(srv.uk?.description || "");
    setEditSrvUkH1(srv.uk?.h1 || "");
    setEditSrvUkBread(srv.uk?.breadcrumb || "");
    setEditSrvRuTitle(srv.ru?.title || "");
    setEditSrvRuDesc(srv.ru?.description || "");
    setEditSrvRuH1(srv.ru?.h1 || "");
    setEditSrvRuBread(srv.ru?.breadcrumb || "");
  };

  // Save Edit Service
  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSrvSlug || !editSrvUkTitle || !editSrvRuTitle) {
      showToast("Заповніть обов'язкові поля послуги!");
      return;
    }

    const updated = servicesList.map(srv => {
      if (srv.slug === editingSrvSlug) {
        return {
          slug: editSrvSlug.toLowerCase().trim(),
          category: editSrvCategory,
          basePrice: editSrvPrice,
          uk: {
            title: editSrvUkTitle.trim(),
            description: editSrvUkDesc.trim() || editSrvUkTitle.trim(),
            h1: editSrvUkH1.trim() || editSrvUkTitle.trim(),
            breadcrumb: editSrvUkBread.trim() || editSrvUkTitle.trim()
          },
          ru: {
            title: editSrvRuTitle.trim(),
            description: editSrvRuDesc.trim() || editSrvRuTitle.trim(),
            h1: editSrvRuH1.trim() || editSrvRuTitle.trim(),
            breadcrumb: editSrvRuBread.trim() || editSrvRuTitle.trim()
          }
        };
      }
      return srv;
    });

    handleSaveStructure("services", updated);
    setEditingSrvSlug(null);
  };

  // Delete Service
  const handleDeleteService = (slug: string) => {
    if (confirm(`Ви дійсно бажаєте видалити послугу [${slug}]? Всі пов'язані сторінки та переклади буде видалено.`)) {
      const updated = servicesList.filter(s => s.slug !== slug);
      handleSaveStructure("services", updated);
    }
  };

  const overrideKey = `${simLocale}-${simCity || "national"}-${simPageType}`;
  const hasOverride = !!(overridesMap[overrideKey]?.title || overridesMap[overrideKey]?.description);

  const totalPages = 2 * (
    7 + 
    citiesList.length + 
    (citiesList.length * 4) + 
    servicesList.length + 
    (citiesList.length * servicesList.length)
  );

  return (
    <div className={styles.container}>
      {toastMessage && (
        <div className={styles.toast}>
          <span>✓</span> {toastMessage}
        </div>
      )}

      {isDefaultPassword && (
        <div className={styles.warningBanner}>
          <span>⚠️</span>
          <div>
            <strong>Увага безпеки!</strong> Ви використовуєте стандартний пароль <code>admin123</code>. 
            Будь ласка, задайте змінну оточення <code>ADMIN_PASSWORD</code> у файлі <code>.env</code> для надійного захисту.
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>NOVA STELYA CMS Layer v4.0</h1>
          <p>Найкраща на ринку Git-based / Static CMS — дизайн, структура сторінок, контакти, та SEO</p>
        </div>
        <div className={styles.headerButtons}>
          <span className={`${styles.statusBadge} ${styles.statusOk}`}>Active (Prod Mode)</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Вийти
          </button>
        </div>
      </header>

      {/* Nav Sidebar & Content layout */}
      <div className={styles.dashboardLayout}>
        <aside className={styles.sidebar}>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`${styles.menuBtn} ${activeTab === "dashboard" ? styles.menuBtnActive : ""}`}
          >
            📊 Головна панель (Stats)
          </button>
          <button
            onClick={() => setActiveTab("structure")}
            className={`${styles.menuBtn} ${activeTab === "structure" ? styles.menuBtnActive : ""}`}
          >
            🗂️ Структура & Сторінки
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`${styles.menuBtn} ${activeTab === "content" ? styles.menuBtnActive : ""}`}
          >
            🧱 Конструктор сторінок
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            className={`${styles.menuBtn} ${activeTab === "theme" ? styles.menuBtnActive : ""}`}
          >
            🎨 Дизайн теми (Theme)
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`${styles.menuBtn} ${activeTab === "contacts" ? styles.menuBtnActive : ""}`}
          >
            📞 Контакти & Соцмережі
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`${styles.menuBtn} ${activeTab === "simulator" ? styles.menuBtnActive : ""}`}
          >
            🔍 SEO SERP Симулятор
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`${styles.menuBtn} ${activeTab === "templates" ? styles.menuBtnActive : ""}`}
          >
            ⚙️ Шаблони метаданих
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`${styles.menuBtn} ${activeTab === "audit" ? styles.menuBtnActive : ""}`}
          >
            ⚡ Масовий SEO аудит
          </button>
        </aside>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {activeTab === "dashboard" && (
            <div>
              <h2 className={styles.sectionTitle}>Панель керування та Аналітика швидкості</h2>
              
              <div className={styles.dashboardGrid}>
                <div className={styles.radarCard}>
                  <div className={styles.radarInfo}>
                    <div className={styles.radarTitle}>PageSpeed Score</div>
                    <div className={styles.radarValue}>100</div>
                    <div className={styles.radarLabel}>Ідеальні Core Web Vitals</div>
                  </div>
                  <svg className={styles.svgRing} viewBox="0 0 100 100">
                    <circle className={styles.ringTrack} cx="50" cy="50" r="40" />
                    <circle className={styles.ringIndicator} cx="50" cy="50" r="40" style={{ strokeDashoffset: 0 }} />
                  </svg>
                </div>

                <div className={styles.radarCard}>
                  <div className={styles.radarInfo}>
                    <div className={styles.radarTitle}>База Даних (DB)</div>
                    <div className={styles.radarValue}>0ms</div>
                    <div className={styles.radarLabel}>Git-based / Static CMS</div>
                  </div>
                  <svg className={styles.svgRing} viewBox="0 0 100 100">
                    <circle className={styles.ringTrack} cx="50" cy="50" r="40" />
                    <circle className={styles.ringIndicatorFast} cx="50" cy="50" r="40" />
                  </svg>
                </div>

                <div className={styles.statusPanelCard}>
                  <h3>Стан Системи</h3>
                  <div className={styles.statusRow}>
                    <span>CMS Core:</span>
                    <strong>Static JSON CMS Engine</strong>
                  </div>
                  <div className={styles.statusRow}>
                    <span>Час затримки:</span>
                    <strong>&lt;0.1ms (Локальне зчитування)</strong>
                  </div>
                  <div className={styles.statusRow}>
                    <span>Всього сторінок:</span>
                    <strong>{totalPages} сторінок згенеровано</strong>
                  </div>
                  <div className={styles.statusRow}>
                    <span>Зв'язок з Git:</span>
                    <strong className={styles.greenText}>Синхронізовано</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "32px" }}>
                <h3>Активна Колірна Палітра Дизайну</h3>
                <div className={styles.paletteGrid}>
                  {Object.entries(themeColors).map(([name, hex]) => (
                    <div key={name} className={styles.paletteItem}>
                      <span className={styles.paletteColorDot} style={{ backgroundColor: hex, boxShadow: `0 0 10px ${hex}` }}></span>
                      <div className={styles.paletteColorInfo}>
                        <span className={styles.paletteColorName}>{name}</span>
                        <span className={styles.paletteColorHex}>{hex}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "32px" }}>
                <h3>Поточні Контакти Бренду</h3>
                <div className={styles.contactsOverviewGrid}>
                  <div className={styles.overviewContactCard}>
                    <strong>Назва компанії:</strong> {contacts.brand || "NOVA STELYA"}
                  </div>
                  <div className={styles.overviewContactCard}>
                    <strong>Телефон офісу:</strong> {contacts.phone || "0 800 000-000"}
                  </div>
                  <div className={styles.overviewContactCard}>
                    <strong>Email:</strong> {contacts.email || "info@novastelya.com"}
                  </div>
                  <div className={styles.overviewContactCard}>
                    <strong>Сайт:</strong> {contacts.url || "https://novastelya.com"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Structure Tab */}
          {activeTab === "structure" && (
            <div>
              <h2 className={styles.sectionTitle}>Керування Структурою: Регіони & Послуги/Приміщення</h2>
              <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                Додавайте, редагуйте та видаляйте міста, категорії послуг та приміщення. При зміні нового регіону чи послуги система автоматично перебудує всі мовні версії сторінок на етапі збірки.
              </p>

              {/* SECTION 1: CITIES */}
              <div className={styles.formContainerCard} style={{ marginBottom: "32px" }}>
                <h3>🏙️ Регіональні офіси (Міста)</h3>
                
                {/* City Table */}
                <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Slug (URL)</th>
                        <th>Назва (UK)</th>
                        <th>Назва (RU)</th>
                        <th>Телефон</th>
                        <th>Модифікатор ціни</th>
                        <th>Статус</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citiesList.map((city) => (
                        <tr key={city.slug}>
                          <td><code>/{city.slug}</code></td>
                          <td><strong>{city.uk}</strong></td>
                          <td>{city.ru}</td>
                          <td>{city.phone}</td>
                          <td>{city.priceModifier}x</td>
                          <td>
                            <span className={`${styles.statusBadge} ${city.active ? styles.statusOk : styles.statusWarn}`}>
                              {city.active ? "Активне" : "Вимкнене"}
                            </span>
                          </td>
                          <td style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => startEditCity(city)}
                              style={{ padding: "4px 8px", background: "rgba(212, 163, 89, 0.15)", color: "#d4a359", border: "1px solid rgba(212, 163, 89, 0.3)", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Редагувати
                            </button>
                            <button
                              onClick={() => handleDeleteCity(city.slug)}
                              style={{ padding: "4px 8px", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Видалити
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* City Form (Add or Edit) */}
                {editingCitySlug ? (
                  <form onSubmit={handleSaveEditCity} className={styles.editorForm} style={{ background: "rgba(212,163,89,0.02)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(212,163,89,0.15)" }}>
                    <h4 style={{ color: "#ffd700", marginBottom: "16px" }}>✏️ Редагувати регіон: {editingCitySlug}</h4>
                    <div className={styles.simControls}>
                      <div className={styles.controlGroup}>
                        <label>Slug (URL) *</label>
                        <input type="text" className={styles.input} value={editCitySlug} onChange={e => setEditCitySlug(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Назва міста (UK) *</label>
                        <input type="text" className={styles.input} value={editCityUk} onChange={e => setEditCityUk(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Назва міста (RU) *</label>
                        <input type="text" className={styles.input} value={editCityRu} onChange={e => setEditCityRu(e.target.value)} required />
                      </div>
                    </div>

                    <div className={styles.simControls} style={{ marginTop: "16px" }}>
                      <div className={styles.controlGroup}>
                        <label>Телефон офісу *</label>
                        <input type="text" className={styles.input} value={editCityPhone} onChange={e => setEditCityPhone(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Адреса (UK) *</label>
                        <input type="text" className={styles.input} value={editCityAddress} onChange={e => setEditCityAddress(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Адреса (RU)</label>
                        <input type="text" className={styles.input} value={editCityAddressRu} onChange={e => setEditCityAddressRu(e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.simControls} style={{ marginTop: "16px" }}>
                      <div className={styles.controlGroup}>
                        <label>ISO Код регіону</label>
                        <input type="text" className={styles.input} value={editCityRegion} onChange={e => setEditCityRegion(e.target.value)} />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Модифікатор ціни</label>
                        <input type="number" step="0.01" className={styles.input} value={editCityPriceMod} onChange={e => setEditCityPriceMod(parseFloat(e.target.value) || 1.0)} />
                      </div>
                      <div className={styles.controlGroup} style={{ justifyContent: "center" }}>
                        <label style={{ display: "flex", gap: "8px", alignItems: "center", cursor: "pointer", marginTop: "24px" }}>
                          <input type="checkbox" checked={editCityActive} onChange={e => setEditCityActive(e.target.checked)} style={{ width: "18px", height: "18px" }} />
                          Активувати генерацію сторінок
                        </label>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                      <button type="submit" className={styles.saveBtn}>
                        💾 Зберегти зміни
                      </button>
                      <button type="button" className={styles.resetBtn} onClick={() => setEditingCitySlug(null)}>
                        Скасувати
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddCity} className={styles.editorForm} style={{ background: "rgba(255,255,255,0.01)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <h4 style={{ color: "#ffd700", marginBottom: "16px" }}>➕ Додати новий регіон (місто)</h4>
                    <div className={styles.simControls}>
                      <div className={styles.controlGroup}>
                        <label>Slug (URL) *</label>
                        <input type="text" className={styles.input} placeholder="poltava" value={newCitySlug} onChange={e => setNewCitySlug(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Назва міста (UK) *</label>
                        <input type="text" className={styles.input} placeholder="Полтава" value={newCityUk} onChange={e => setNewCityUk(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Назва міста (RU) *</label>
                        <input type="text" className={styles.input} placeholder="Полтава" value={newCityRu} onChange={e => setNewCityRu(e.target.value)} required />
                      </div>
                    </div>

                    <div className={styles.simControls} style={{ marginTop: "16px" }}>
                      <div className={styles.controlGroup}>
                        <label>Телефон офісу *</label>
                        <input type="text" className={styles.input} placeholder="+380 53 000-00-00" value={newCityPhone} onChange={e => setNewCityPhone(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Адреса (UK) *</label>
                        <input type="text" className={styles.input} placeholder="вул. Соборності, 1, Полтава" value={newCityAddress} onChange={e => setNewCityAddress(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Адреса (RU)</label>
                        <input type="text" className={styles.input} placeholder="ул. Соборности, 1, Полтава" value={newCityAddressRu} onChange={e => setNewCityAddressRu(e.target.value)} />
                      </div>
                    </div>

                    <button type="submit" className={styles.saveBtn} style={{ marginTop: "20px" }}>
                      ➕ Зберегти та згенерувати регіон
                    </button>
                  </form>
                )}
              </div>

              {/* SECTION 2: SERVICES & ROOMS */}
              <div className={styles.formContainerCard}>
                <h3>🛠️ Каталог послуг та Приміщень</h3>

                {/* Services Table */}
                <div style={{ overflowX: "auto", marginBottom: "24px" }}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Slug (URL)</th>
                        <th>Категорія</th>
                        <th>Назва (UK)</th>
                        <th>Назва (RU)</th>
                        <th>Базова ціна</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesList.map((srv) => (
                        <tr key={srv.slug}>
                          <td><code>/{srv.slug}</code></td>
                          <td>
                            <span style={{ fontSize: "0.8rem", padding: "2px 6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px" }}>
                              {srv.category}
                            </span>
                          </td>
                          <td><strong>{srv.uk?.title}</strong></td>
                          <td>{srv.ru?.title}</td>
                          <td>{srv.basePrice} грн</td>
                          <td style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => startEditService(srv)}
                              style={{ padding: "4px 8px", background: "rgba(212, 163, 89, 0.15)", color: "#d4a359", border: "1px solid rgba(212, 163, 89, 0.3)", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Редагувати
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.slug)}
                              style={{ padding: "4px 8px", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "4px", cursor: "pointer" }}
                            >
                              Видалити
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Service Form (Add or Edit) */}
                {editingSrvSlug ? (
                  <form onSubmit={handleSaveEditService} className={styles.editorForm} style={{ background: "rgba(212,163,89,0.02)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(212,163,89,0.15)" }}>
                    <h4 style={{ color: "#ffd700", marginBottom: "16px" }}>✏️ Редагувати послугу: {editingSrvSlug}</h4>
                    
                    <div className={styles.simControls}>
                      <div className={styles.controlGroup}>
                        <label>Slug (URL) *</label>
                        <input type="text" className={styles.input} value={editSrvSlug} onChange={e => setEditSrvSlug(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Категорія *</label>
                        <select className={styles.select} value={editSrvCategory} onChange={e => setEditSrvCategory(e.target.value as any)}>
                          <option value="rooms">Приміщення (Rooms)</option>
                          <option value="materials">Матеріали (Materials)</option>
                          <option value="designs">Конструкції (Designs)</option>
                          <option value="lighting">Освітлення (Lighting)</option>
                        </select>
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Базова ціна за м² (грн) *</label>
                        <input type="number" className={styles.input} value={editSrvPrice} onChange={e => setEditSrvPrice(parseInt(e.target.value) || 250)} required />
                      </div>
                    </div>

                    <h5 style={{ color: "#ffffff", marginTop: "20px", marginBottom: "10px" }}>🇺🇦 Український переклад (UK)</h5>
                    <div className={styles.simControls}>
                      <div className={styles.controlGroup}>
                        <label>Заголовок (Title) *</label>
                        <input type="text" className={styles.input} value={editSrvUkTitle} onChange={e => setEditSrvUkTitle(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Хлебні крихти (Breadcrumb) *</label>
                        <input type="text" className={styles.input} value={editSrvUkBread} onChange={e => setEditSrvUkBread(e.target.value)} required />
                      </div>
                    </div>
                    <div className={styles.simControls} style={{ marginTop: "12px" }}>
                      <div className={styles.controlGroup}>
                        <label>Заголовок H1 *</label>
                        <input type="text" className={styles.input} value={editSrvUkH1} onChange={e => setEditSrvUkH1(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Опис (Description) *</label>
                        <input type="text" className={styles.input} value={editSrvUkDesc} onChange={e => setEditSrvUkDesc(e.target.value)} required />
                      </div>
                    </div>

                    <h5 style={{ color: "#ffffff", marginTop: "20px", marginBottom: "10px" }}>🇷🇺 Російський переклад (RU)</h5>
                    <div className={styles.simControls}>
                      <div className={styles.controlGroup}>
                        <label>Заголовок (Title) *</label>
                        <input type="text" className={styles.input} value={editSrvRuTitle} onChange={e => setEditSrvRuTitle(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Хлебні крихти (Breadcrumb) *</label>
                        <input type="text" className={styles.input} value={editSrvRuBread} onChange={e => setEditSrvRuBread(e.target.value)} required />
                      </div>
                    </div>
                    <div className={styles.simControls} style={{ marginTop: "12px" }}>
                      <div className={styles.controlGroup}>
                        <label>Заголовок H1 *</label>
                        <input type="text" className={styles.input} value={editSrvRuH1} onChange={e => setEditSrvRuH1(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Опис (Description) *</label>
                        <input type="text" className={styles.input} value={editSrvRuDesc} onChange={e => setEditSrvRuDesc(e.target.value)} required />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                      <button type="submit" className={styles.saveBtn}>
                        💾 Зберегти зміни
                      </button>
                      <button type="button" className={styles.resetBtn} onClick={() => setEditingSrvSlug(null)}>
                        Скасувати
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleAddService} className={styles.editorForm} style={{ background: "rgba(255,255,255,0.01)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <h4 style={{ color: "#ffd700", marginBottom: "16px" }}>➕ Додати нову послугу або приміщення</h4>
                    
                    <div className={styles.simControls}>
                      <div className={styles.controlGroup}>
                        <label>Slug (URL) *</label>
                        <input type="text" className={styles.input} placeholder="office-ceilings" value={newSrvSlug} onChange={e => setNewSrvSlug(e.target.value)} required />
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Категорія *</label>
                        <select className={styles.select} value={newSrvCategory} onChange={e => setNewSrvCategory(e.target.value as any)}>
                          <option value="rooms">Приміщення (Rooms)</option>
                          <option value="materials">Матеріали (Materials)</option>
                          <option value="designs">Конструкції (Designs)</option>
                          <option value="lighting">Освітлення (Lighting)</option>
                        </select>
                      </div>
                      <div className={styles.controlGroup}>
                        <label>Базова ціна за м² (грн) *</label>
                        <input type="number" className={styles.input} placeholder="300" value={newSrvPrice} onChange={e => setNewSrvPrice(parseInt(e.target.value) || 250)} required />
                      </div>
                    </div>

                    <button type="submit" className={styles.saveBtn} style={{ marginTop: "20px" }}>
                      ➕ Зберегти та згенерувати послугу/кімнату
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Content Builder Tab */}
          {activeTab === "content" && (
            <div>
              <h2 className={styles.sectionTitle}>🧱 Конструктор сторінок та візуальних блоків</h2>
              <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                Створюйте та налаштовуйте структуру сторінок у реальному часі. Ви можете міняти блоки місцями, додавати нові секції та налаштовувати переклади. Якщо ви очистите всі блоки, сторінка автоматично повернеться до стандартного коду.
              </p>

              {/* Selector Bar */}
              <div className={styles.simControls} style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "32px" }}>
                <div className={styles.controlGroup}>
                  <label>Оберіть сторінку для редагування</label>
                  <select
                    className={styles.select}
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                  >
                    {servicesList.map((srv) => (
                      <option key={srv.slug} value={srv.slug}>
                        {srv.uk?.title} ({srv.slug})
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.controlGroup}>
                  <label>Мова передперегляду</label>
                  <select
                    className={styles.select}
                    value={builderLocale}
                    onChange={(e) => setBuilderLocale(e.target.value as any)}
                  >
                    <option value="uk">Українська (UK)</option>
                    <option value="ru">Російська (RU)</option>
                  </select>
                </div>
                <div className={styles.controlGroup}>
                  <label>Регіон передперегляду (місто)</label>
                  <select
                    className={styles.select}
                    value={builderCity}
                    onChange={(e) => setBuilderCity(e.target.value)}
                  >
                    <option value="">Національний (Вся Україна)</option>
                    {citiesList.map((city) => (
                      <option key={city.slug} value={city.slug}>
                        {city.uk}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Builder Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "480px 1fr", gap: "32px", alignItems: "start" }}>
                
                {/* Left Side: Blocks Manager & Field Editors */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  
                  {/* Actions & Save bar */}
                  <div className={styles.formContainerCard} style={{ padding: "20px" }}>
                    <h4 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#ffd700" }}>Дії з контентом</h4>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={handleSaveContent}
                        disabled={isSavingContent}
                        className={styles.saveBtn}
                        style={{ flex: 1, justifyContent: "center" }}
                      >
                        {isSavingContent ? "Збереження..." : "💾 Опублікувати"}
                      </button>
                      <button
                        onClick={handleRevertContent}
                        disabled={isSavingContent}
                        className={styles.resetBtn}
                        style={{ padding: "12px 16px" }}
                      >
                        Скинути до коду
                      </button>
                    </div>
                  </div>

                  {/* Add Block Selector */}
                  <div className={styles.formContainerCard} style={{ padding: "20px" }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem" }}>➕ Додати нову секцію</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                      <button onClick={() => addBlock("HeroBlock")} className={styles.resetBtn} style={{ padding: "8px", fontSize: "0.85rem" }}>Hero Шапка</button>
                      <button onClick={() => addBlock("BenefitsBlock")} className={styles.resetBtn} style={{ padding: "8px", fontSize: "0.85rem" }}>Переваги</button>
                      <button onClick={() => addBlock("CtaBlock")} className={styles.resetBtn} style={{ padding: "8px", fontSize: "0.85rem" }}>CTA Заклик</button>
                      <button onClick={() => addBlock("FaqBlock")} className={styles.resetBtn} style={{ padding: "8px", fontSize: "0.85rem" }}>FAQ Акордеон</button>
                      <button onClick={() => addBlock("RichTextBlock")} className={styles.resetBtn} style={{ padding: "8px", fontSize: "0.85rem", gridColumn: "span 2" }}>Текстовий блок (HTML)</button>
                    </div>
                  </div>

                  {/* Current Blocks List */}
                  <div className={styles.formContainerCard} style={{ padding: "20px" }}>
                    <h4 style={{ margin: "0 0 16px 0", fontSize: "1rem" }}>🧱 Черговість секцій на сторінці</h4>
                    {pageBlocks.length === 0 ? (
                      <div style={{ color: "#64748b", fontStyle: "italic", fontSize: "0.9rem", textAlign: "center", padding: "20px 0" }}>
                        Блоки відсутні. Використовується стандартна верстка з коду сторінки. Додайте перший блок, щоб почати візуальне налаштування!
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {pageBlocks.map((block, idx) => {
                          const isSelected = selectedBlockId === block.id;
                          return (
                            <div
                              key={block.id}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                border: isSelected ? "1px solid var(--color-gold)" : "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "8px",
                                background: isSelected ? "rgba(212,163,89,0.03)" : "rgba(255,255,255,0.01)",
                                overflow: "hidden"
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  padding: "10px 14px",
                                  cursor: "pointer"
                                }}
                                onClick={() => setSelectedBlockId(block.id)}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>#{idx + 1}</span>
                                  <strong style={{ fontSize: "0.9rem", color: isSelected ? "var(--color-gold)" : "#fff" }}>
                                    {block.type}
                                  </strong>
                                </div>
                                <div style={{ display: "flex", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => moveBlock(idx, "up")}
                                    disabled={idx === 0}
                                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px 6px" }}
                                  >
                                    ▲
                                  </button>
                                  <button
                                    onClick={() => moveBlock(idx, "down")}
                                    disabled={idx === pageBlocks.length - 1}
                                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px 6px" }}
                                  >
                                    ▼
                                  </button>
                                  <button
                                    onClick={() => deleteBlock(block.id)}
                                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px 6px", fontWeight: "bold" }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              {/* Nested Field Editor for selected block */}
                              {isSelected && (
                                <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
                                  
                                  {/* Render fields based on block type */}
                                  {(block.type === "HeroBlock" || block.type === "HeroSection" || block.type === "CtaBlock" || block.type === "CtaSection") && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Заголовок (UK)</label>
                                        <input type="text" className={styles.inputMeta} value={block.uk?.title || ""} onChange={(e) => updateBlockField(block.id, "uk", "title", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Заголовок (RU)</label>
                                        <input type="text" className={styles.inputMeta} value={block.ru?.title || ""} onChange={(e) => updateBlockField(block.id, "ru", "title", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Підзаголовок / Опис (UK)</label>
                                        <textarea className={styles.textareaMeta} style={{ minHeight: "60px" }} value={block.uk?.subtitle || ""} onChange={(e) => updateBlockField(block.id, "uk", "subtitle", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Подзаголовок / Описание (RU)</label>
                                        <textarea className={styles.textareaMeta} style={{ minHeight: "60px" }} value={block.ru?.subtitle || ""} onChange={(e) => updateBlockField(block.id, "ru", "subtitle", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Текст кнопки (UK)</label>
                                        <input type="text" className={styles.inputMeta} value={block.uk?.btnText || ""} onChange={(e) => updateBlockField(block.id, "uk", "btnText", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Текст кнопки (RU)</label>
                                        <input type="text" className={styles.inputMeta} value={block.ru?.btnText || ""} onChange={(e) => updateBlockField(block.id, "ru", "btnText", e.target.value)} />
                                      </div>
                                    </div>
                                  )}

                                  {(block.type === "BenefitsBlock" || block.type === "BenefitsSection") && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Заголовок секції (UK)</label>
                                        <input type="text" className={styles.inputMeta} value={block.uk?.title || ""} onChange={(e) => updateBlockField(block.id, "uk", "title", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Заголовок секции (RU)</label>
                                        <input type="text" className={styles.inputMeta} value={block.ru?.title || ""} onChange={(e) => updateBlockField(block.id, "ru", "title", e.target.value)} />
                                      </div>
                                      
                                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px", marginTop: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                          <strong style={{ fontSize: "0.8rem" }}>Картки переваг</strong>
                                          <button onClick={() => addBenefitItem(block.id)} className={styles.resetBtn} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>+ Додати</button>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                          {(block.benefits || []).map((ben: any, bIdx: number) => (
                                            <div key={bIdx} style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.04)" }}>
                                              <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                                                <div style={{ width: "60px" }}>
                                                  <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Іконка</label>
                                                  <input type="text" className={styles.inputMeta} style={{ padding: "6px", textAlign: "center" }} value={ben.icon || ""} onChange={(e) => updateBenefitItem(block.id, bIdx, "icon", e.target.value)} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                  <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Назва UK</label>
                                                  <input type="text" className={styles.inputMeta} style={{ padding: "6px" }} value={ben.uk?.title || ""} onChange={(e) => updateBenefitItem(block.id, bIdx, "title", e.target.value, "uk")} />
                                                </div>
                                                <button onClick={() => removeBenefitItem(block.id, bIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", alignSelf: "flex-end", padding: "6px" }}>✕</button>
                                              </div>
                                              <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                                                <div style={{ flex: 1 }}>
                                                  <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Назва RU</label>
                                                  <input type="text" className={styles.inputMeta} style={{ padding: "6px" }} value={ben.ru?.title || ""} onChange={(e) => updateBenefitItem(block.id, bIdx, "title", e.target.value, "ru")} />
                                                </div>
                                              </div>
                                              <div>
                                                <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Опис UK</label>
                                                <input type="text" className={styles.inputMeta} style={{ padding: "6px" }} value={ben.uk?.description || ""} onChange={(e) => updateBenefitItem(block.id, bIdx, "description", e.target.value, "uk")} />
                                              </div>
                                              <div style={{ marginTop: "4px" }}>
                                                <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Описание RU</label>
                                                <input type="text" className={styles.inputMeta} style={{ padding: "6px" }} value={ben.ru?.description || ""} onChange={(e) => updateBenefitItem(block.id, bIdx, "description", e.target.value, "ru")} />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {(block.type === "FaqBlock" || block.type === "FaqSection") && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Заголовок секції (UK)</label>
                                        <input type="text" className={styles.inputMeta} value={block.uk?.title || ""} onChange={(e) => updateBlockField(block.id, "uk", "title", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Заголовок секции (RU)</label>
                                        <input type="text" className={styles.inputMeta} value={block.ru?.title || ""} onChange={(e) => updateBlockField(block.id, "ru", "title", e.target.value)} />
                                      </div>

                                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px", marginTop: "10px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                          <strong style={{ fontSize: "0.8rem" }}>Запитання та Відповіді</strong>
                                          <button onClick={() => addFaqItem(block.id)} className={styles.resetBtn} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>+ Додати</button>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                          {(block.faqs || []).map((faq: any, fIdx: number) => (
                                            <div key={fIdx} style={{ background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.04)" }}>
                                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Питання #{fIdx + 1}</span>
                                                <button onClick={() => removeFaqItem(block.id, fIdx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}>✕</button>
                                              </div>
                                              <div style={{ marginBottom: "6px" }}>
                                                <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Запитання UK</label>
                                                <input type="text" className={styles.inputMeta} style={{ padding: "6px" }} value={faq.uk?.q || ""} onChange={(e) => updateFaqItem(block.id, fIdx, "q", e.target.value, "uk")} />
                                              </div>
                                              <div style={{ marginBottom: "6px" }}>
                                                <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Вопрос RU</label>
                                                <input type="text" className={styles.inputMeta} style={{ padding: "6px" }} value={faq.ru?.q || ""} onChange={(e) => updateFaqItem(block.id, fIdx, "q", e.target.value, "ru")} />
                                              </div>
                                              <div style={{ marginBottom: "6px" }}>
                                                <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Відповідь UK</label>
                                                <textarea className={styles.textareaMeta} style={{ minHeight: "50px", padding: "6px" }} value={faq.uk?.a || ""} onChange={(e) => updateFaqItem(block.id, fIdx, "a", e.target.value, "uk")} />
                                              </div>
                                              <div>
                                                <label style={{ fontSize: "0.7rem", color: "#64748b" }}>Ответ RU</label>
                                                <textarea className={styles.textareaMeta} style={{ minHeight: "50px", padding: "6px" }} value={faq.ru?.a || ""} onChange={(e) => updateFaqItem(block.id, fIdx, "a", e.target.value, "ru")} />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {(block.type === "RichTextBlock" || block.type === "RichTextSection") && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Вміст блоку HTML (UK)</label>
                                        <textarea className={styles.textareaMeta} style={{ minHeight: "150px", fontFamily: "monospace", fontSize: "0.85rem" }} value={block.uk?.content || ""} onChange={(e) => updateBlockField(block.id, "uk", "content", e.target.value)} />
                                      </div>
                                      <div>
                                        <label style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "4px" }}>Содержимое блока HTML (RU)</label>
                                        <textarea className={styles.textareaMeta} style={{ minHeight: "150px", fontFamily: "monospace", fontSize: "0.85rem" }} value={block.ru?.content || ""} onChange={(e) => updateBlockField(block.id, "ru", "content", e.target.value)} />
                                      </div>
                                    </div>
                                  )}

                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Visual Live Mockup Preview */}
                <div style={{ position: "sticky", top: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>📱 Попередній перегляд у реальному часі</h3>
                    <span style={{ fontSize: "0.8rem", color: "#ffd700", background: "rgba(212,163,89,0.1)", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(212,163,89,0.2)" }}>
                      Режим WYSIWYG
                    </span>
                  </div>

                  <div
                    style={{
                      background: "var(--theme-colors-bg, #0a0b0e)",
                      color: "var(--theme-colors-text, #ebedf0)",
                      borderRadius: "16px",
                      border: "4px solid var(--theme-colors-border, #22262f)",
                      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                      overflowY: "auto",
                      height: "800px",
                      padding: "20px",
                      fontFamily: "var(--theme-fonts-sans, 'Inter', sans-serif)"
                    }}
                  >
                    {pageBlocks.length === 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b", textAlign: "center", gap: "16px" }}>
                        <span style={{ fontSize: "3rem" }}>🧱</span>
                        <div>
                          <strong>Стандартний макет активний</strong>
                          <p style={{ fontSize: "0.85rem", margin: "4px 0 0 0" }}>Буде відрендерено код сторінки за замовчуванням</p>
                        </div>
                      </div>
                    ) : (
                      <div className="preview-theme-wrapper">
                        {/* We inject style properties directly for the live preview to honor visual configurations */}
                        <BlockRenderer
                          blocks={pageBlocks}
                          locale={builderLocale}
                          city={citiesList.find((c) => c.slug === builderCity) || null}
                          defaultH1="Приклад натяжної стелі"
                          defaultDesc="Це опис послуги, який автоматично підтягується з конфігу, якщо ви не введете інший заголовок секції."
                          finalPrice={300}
                          defaultBenefits={[
                            { icon: "💎", uk: { title: "Естетика та стиль", description: "Ідеальний вигляд" }, ru: { title: "Эстетика и стиль", description: "Идеальный вид" } },
                            { icon: "🛡️", uk: { title: "Надійність", description: "Захист від протікання" }, ru: { title: "Надежность", description: "Защита от протечек" } }
                          ]}
                          defaultFaqs={[
                            { uk: { q: "Яка гарантія?", a: "Ми надаємо офіційну гарантію 10 років." }, ru: { q: "Какая гарантия?", a: "Мы предоставляем официальную гарантию 10 лет." } }
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Theme customizer tab */}
          {activeTab === "theme" && (
            <div>
              <h2 className={styles.sectionTitle}>Керування Дизайном & Колірною Палітрою</h2>
              <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                Змінюйте кольори, шрифти та скруглення інтерфейсу в реальному часі. Усі зміни миттєво записуються у файл конфігурації і не сповільнюють сайт ні на мілісекунду.
              </p>

              <div className={styles.editorGrid}>
                {/* Form fields */}
                <div className={styles.formContainerCard}>
                  <h3>Кольори Теми</h3>
                  <div className={styles.colorsFormGrid}>
                    {Object.keys(themeColors).map((key) => (
                      <div key={key} className={styles.colorInputGroup}>
                        <label>{key}</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="color"
                            value={themeColors[key] || "#000000"}
                            onChange={(e) => {
                              setThemeColors({
                                ...themeColors,
                                [key]: e.target.value
                              });
                            }}
                            className={styles.colorPicker}
                          />
                          <input
                            type="text"
                            value={themeColors[key] || ""}
                            onChange={(e) => {
                              setThemeColors({
                                ...themeColors,
                                [key]: e.target.value
                              });
                            }}
                            className={styles.input}
                            style={{ flex: 1, padding: "8px" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 style={{ marginTop: "24px" }}>Шрифти</h3>
                  <div className={styles.colorsFormGrid}>
                    <div className={styles.inputGroup}>
                      <label>Sans-Serif Font Family (Основний)</label>
                      <input
                        type="text"
                        value={themeFonts.sans || ""}
                        onChange={(e) => setThemeFonts({ ...themeFonts, sans: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Serif Font Family (Заголовки)</label>
                      <input
                        type="text"
                        value={themeFonts.serif || ""}
                        onChange={(e) => setThemeFonts({ ...themeFonts, serif: e.target.value })}
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <h3 style={{ marginTop: "24px" }}>Скруглення Граней (Border Radius)</h3>
                  <div className={styles.radiusFormGrid}>
                    {Object.keys(themeRadius).map((key) => (
                      <div key={key} className={styles.inputGroup}>
                        <label>Radius: {key.toUpperCase()}</label>
                        <input
                          type="text"
                          value={themeRadius[key] || ""}
                          onChange={(e) => setThemeRadius({ ...themeRadius, [key]: e.target.value })}
                          className={styles.input}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                    <button
                      onClick={() => handleSaveSettings(themeColors, themeFonts, themeRadius, contacts)}
                      disabled={isSavingSettings}
                      className={styles.saveBtn}
                    >
                      {isSavingSettings ? "Збереження..." : "💾 Зберегти зміни"}
                    </button>
                    <button
                      onClick={handleResetSettings}
                      className={styles.resetBtn}
                    >
                      Скинути до стандартних
                    </button>
                  </div>
                </div>

                {/* Preview Mini Phone Template mockup */}
                <div>
                  <div className={styles.mockupContainer}>
                    <div className={styles.mockupTitle}>Попередній перегляд теми</div>
                    <div className={styles.phoneMockup} style={{
                      backgroundColor: themeColors.bg,
                      color: themeColors.text,
                      borderRadius: "24px",
                      fontFamily: themeFonts.sans
                    }}>
                      <div className={styles.phoneHeader} style={{ borderColor: themeColors.border }}>
                        <span style={{ fontSize: "0.8rem", color: themeColors.textSecondary }}>NOVA STELYA</span>
                        <span className={styles.phoneContactBtn} style={{
                          backgroundColor: themeColors.gold,
                          color: "#000",
                          borderRadius: themeRadius.sm
                        }}>Дзвінок</span>
                      </div>
                      
                      <div className={styles.phoneBody}>
                        <h2 style={{ fontFamily: themeFonts.serif, color: themeColors.text, fontSize: "1.4rem" }}>
                          Натяжні стелі <span style={{ color: themeColors.gold }}>преміум</span> класу
                        </h2>
                        
                        <p style={{ color: themeColors.textSecondary, fontSize: "0.85rem" }}>
                          Встановлення натяжних стель у Києві та всій Україні. Ідеальна якість та гарантія 15 років.
                        </p>
                        
                        <div className={styles.phoneCard} style={{
                          backgroundColor: themeColors.bgSecondary,
                          borderColor: themeColors.border,
                          borderRadius: themeRadius.md
                        }}>
                          <span style={{ fontSize: "0.75rem", color: themeColors.textMuted }}>Вартість від</span>
                          <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: themeColors.gold }}>250 грн/м²</div>
                        </div>

                        <button style={{
                          backgroundColor: themeColors.gold,
                          color: "#000",
                          borderRadius: themeRadius.md,
                          padding: "10px",
                          width: "100%",
                          border: "none",
                          fontWeight: "bold",
                          marginTop: "16px",
                          fontSize: "0.85rem",
                          cursor: "pointer"
                        }}>
                          Замовити безкоштовний замір
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contacts & Socials Tab */}
          {activeTab === "contacts" && (
            <div>
              <h2 className={styles.sectionTitle}>Керування Контактами, Брендом & Соцмережами</h2>
              <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                Ці контакти автоматично впроваджуються в метадані SEO, розмітку Schema.org, OpenGraph та футер сайту.
              </p>

              <div className={styles.formContainerCard} style={{ maxWidth: "800px" }}>
                <h3>Інформація Бренду</h3>
                <div className={styles.contactsGrid}>
                  <div className={styles.inputGroup}>
                    <label>Назва бренду (Brand Name)</label>
                    <input
                      type="text"
                      value={contacts.brand || ""}
                      onChange={(e) => setContacts({ ...contacts, brand: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Назва сайту (Site Title Name)</label>
                    <input
                      type="text"
                      value={contacts.siteName || ""}
                      onChange={(e) => setContacts({ ...contacts, siteName: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Канонічний URL сайту</label>
                    <input
                      type="text"
                      value={contacts.url || ""}
                      onChange={(e) => setContacts({ ...contacts, url: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Рік заснування бренду</label>
                    <input
                      type="number"
                      value={contacts.foundingYear || 2015}
                      onChange={(e) => setContacts({ ...contacts, foundingYear: parseInt(e.target.value) || 2015 })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <h3 style={{ marginTop: "24px" }}>Зворотний зв'язок</h3>
                <div className={styles.contactsGrid}>
                  <div className={styles.inputGroup}>
                    <label>Основний номер телефону</label>
                    <input
                      type="text"
                      value={contacts.phone || ""}
                      onChange={(e) => setContacts({ ...contacts, phone: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Контактний Email</label>
                    <input
                      type="text"
                      value={contacts.email || ""}
                      onChange={(e) => setContacts({ ...contacts, email: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <h3 style={{ marginTop: "24px" }}>Посилання на соціальні мережі</h3>
                <div className={styles.contactsGrid}>
                  <div className={styles.inputGroup}>
                    <label>Instagram URL</label>
                    <input
                      type="text"
                      value={contacts.socials?.instagram || ""}
                      onChange={(e) => setContacts({
                        ...contacts,
                        socials: { ...contacts.socials, instagram: e.target.value }
                      })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Facebook URL</label>
                    <input
                      type="text"
                      value={contacts.socials?.facebook || ""}
                      onChange={(e) => setContacts({
                        ...contacts,
                        socials: { ...contacts.socials, facebook: e.target.value }
                      })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Telegram Link</label>
                    <input
                      type="text"
                      value={contacts.socials?.telegram || ""}
                      onChange={(e) => setContacts({
                        ...contacts,
                        socials: { ...contacts.socials, telegram: e.target.value }
                      })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Viber Link</label>
                    <input
                      type="text"
                      value={contacts.socials?.viber || ""}
                      onChange={(e) => setContacts({
                        ...contacts,
                        socials: { ...contacts.socials, viber: e.target.value }
                      })}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", marginTop: "32px" }}>
                  <button
                    onClick={() => handleSaveSettings(themeColors, themeFonts, themeRadius, contacts)}
                    disabled={isSavingSettings}
                    className={styles.saveBtn}
                  >
                    {isSavingSettings ? "Збереження..." : "💾 Зберегти зміни"}
                  </button>
                  <button
                    onClick={handleResetSettings}
                    className={styles.resetBtn}
                  >
                    Скинути до стандартних
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "simulator" && (
            <div>
              <h2 className={styles.sectionTitle}>Google SERP Симулятор та Візуальний Редактор</h2>
              
              <div className={styles.simControls}>
                <div className={styles.controlGroup}>
                  <label>Мова (локаль)</label>
                  <select
                    className={styles.select}
                    value={simLocale}
                    onChange={(e) => setSimLocale(e.target.value as any)}
                  >
                    <option value="uk">Українська (Default)</option>
                    <option value="ru">Російська (/ru)</option>
                  </select>
                </div>

                <div className={styles.controlGroup}>
                  <label>Регіон (Місто)</label>
                  <select
                    className={styles.select}
                    value={simCity}
                    onChange={(e) => setSimCity(e.target.value)}
                  >
                    <option value="">Національний (Вся Україна)</option>
                    {citiesList.map((city) => (
                      <option key={city.slug} value={city.slug}>
                        {city.uk}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.controlGroup}>
                  <label>Тип сторінки / Послуга</label>
                  <select
                    className={styles.select}
                    value={simPageType}
                    onChange={(e) => setSimPageType(e.target.value)}
                  >
                    <option value="home">Головна сторінка</option>
                    <option value="prices">Ціни</option>
                    <option value="faq">FAQ</option>
                    <option value="portfolio">Портфоліо</option>
                    <option value="contacts">Контакти</option>
                    <option value="about">Про компанію</option>
                    <optgroup label="Послуги">
                      {servicesList.map((service) => (
                        <option key={service.slug} value={service.slug}>
                          {service.uk?.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Desktop / Mobile Toggle */}
              <div className={styles.deviceToggle}>
                <button
                  className={`${styles.deviceBtn} ${deviceType === "desktop" ? styles.deviceBtnActive : ""}`}
                  onClick={() => setDeviceType("desktop")}
                >
                  💻 Десктопний вигляд
                </button>
                <button
                  className={`${styles.deviceBtn} ${deviceType === "mobile" ? styles.deviceBtnActive : ""}`}
                  onClick={() => setDeviceType("mobile")}
                >
                  📱 Мобільний вигляд
                </button>
              </div>

              <div className={styles.simulatorGrid}>
                {/* Simulator Card */}
                <div>
                  {metadataPreview && (
                    <>
                      <h3>Вигляд у пошуковій видачі Google:</h3>
                      {deviceType === "desktop" ? (
                        <div className={styles.previewCard}>
                          <div className={styles.serpUrl}>
                            <span>https://novastelya.com</span>
                            <span>›</span>
                            <span>
                              {simLocale === "ru" ? "ru" : ""}
                              {simCity ? ` › ${simCity}` : ""}
                              {simPageType !== "home" ? ` › ${simPageType}` : ""}
                            </span>
                          </div>
                          <div className={styles.serpTitle}>{editTitle}</div>
                          <div className={styles.serpSnippet}>{editDescription}</div>
                        </div>
                      ) : (
                        <div className={styles.mobilePreviewCard}>
                          <div className={styles.mobileHeader}>
                            <div className={styles.mobileFavicon}>N</div>
                            <div className={styles.mobileSiteInfo}>
                              <span className={styles.mobileSiteName}>NOVA STELYA</span>
                              <span className={styles.mobileUrlText}>
                                novastelya.com{simLocale === "ru" ? "/ru" : ""}{simCity ? `/${simCity}` : ""}{simPageType !== "home" ? `/${simPageType}` : ""}
                              </span>
                            </div>
                          </div>
                          <div className={styles.mobileTitle}>{editTitle}</div>
                          <div className={styles.mobileSnippet}>{editDescription}</div>
                        </div>
                      )}
                    </>
                  )}

                   {/* Visual Editor Form */}
                  <div className={styles.editorCard}>
                    <div className={styles.editorTitle}>
                      <span>✏️</span> Точкове редагування
                      {hasOverride ? (
                        <span className={styles.overrideBadgeActive}>Індивідуальний оверрайд</span>
                      ) : (
                        <span className={styles.overrideBadgeDefault}>Глобальний шаблон</span>
                      )}
                    </div>
                    <div className={styles.editorForm}>
                      <div className={styles.editorGroup}>
                        <div className={styles.editorHeaderRow}>
                          <label>Заголовок (Title)</label>
                          <span className={`${styles.charCounter} ${
                            editTitle.length > 60 || editTitle.length < 30 ? styles.charCounterWarn : styles.charCounterOk
                          }`}>
                            {editTitle.length} / 60
                          </span>
                        </div>
                        <input
                          type="text"
                          className={styles.inputMeta}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Введіть заголовок сторінки"
                        />
                      </div>

                      <div className={styles.editorGroup}>
                        <div className={styles.editorHeaderRow}>
                          <label>Опис (Description)</label>
                          <span className={`${styles.charCounter} ${
                            editDescription.length > 160 || editDescription.length < 110 ? styles.charCounterWarn : styles.charCounterOk
                          }`}>
                            {editDescription.length} / 160
                          </span>
                        </div>
                        <textarea
                          className={styles.textareaMeta}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Введіть опис сторінки"
                        />
                      </div>

                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button
                          onClick={handleSaveOverrides}
                          disabled={isSaving}
                          className={styles.saveBtn}
                        >
                          {isSaving ? "Збереження..." : "💾 Зберегти зміни"}
                        </button>
                        {hasOverride && (
                          <button
                            onClick={handleDeleteOverride}
                            disabled={isSaving}
                            className={styles.deleteOverrideBtn}
                            type="button"
                          >
                            Скинути до шаблону
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Audit Sidebar */}
                <div>
                  {realtimeAudit && (
                    <div className={styles.auditCard}>
                      <div className={styles.auditHeaderRow}>
                        <div className={styles.auditSectionTitle}>🔥 Експрес-Аудит</div>
                        <div className={`${styles.auditScoreCircle} ${
                          realtimeAudit.score >= 85 ? styles.scoreCircleOk : realtimeAudit.score >= 60 ? styles.scoreCircleWarn : styles.scoreCircleError
                        }`}>
                          {realtimeAudit.score}
                        </div>
                      </div>

                      <div className={styles.auditSectionTitle}>Виявлені фактори:</div>
                      <div className={styles.issueList}>
                        {realtimeAudit.issues.map((issue: string, idx: number) => {
                          const isErr = issue.toLowerCase().includes("критично");
                          const isOk = issue.toLowerCase().includes("зауважень немає");
                          return (
                            <div
                              key={idx}
                              className={`${styles.issueItem} ${
                                isErr ? styles.issueItemError : isOk ? styles.issueItemOk : styles.issueItemWarn
                              }`}
                            >
                              <span>{isErr ? "❌" : isOk ? "✅" : "⚠️"}</span>
                              <span>{issue}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className={styles.auditSectionTitle}>Густота ключових слів (Density):</div>
                      <div className={styles.densityBadgeList}>
                        {Object.entries(realtimeAudit.keywordDensity).map(([word, pct]: [string, any]) => (
                          <div
                            key={word}
                            className={`${styles.densityBadge} ${pct > 35 ? styles.densitySpam : ""}`}
                          >
                            <span>{word}</span>
                            <span className={styles.densityValue}>{pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {metadataPreview && (
                <>
                  <h3 style={{ marginTop: "32px" }}>Канонічний URL (Canonical):</h3>
                  <div className={styles.codeBlock} style={{ marginBottom: "20px" }}>
                    {metadataPreview.canonical}
                  </div>

                  <h3>Язикові версії Alternates (Hreflang):</h3>
                  <div className={styles.codeBlock} style={{ marginBottom: "20px" }}>
                    {JSON.stringify(metadataPreview.hreflangs, null, 2)}
                  </div>

                  <h3>Генерована розмітка Schema.org JSON-LD:</h3>
                  <div className={styles.codeBlock}>
                    {JSON.stringify(metadataPreview.schema, null, 2)}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "templates" && (
            <div>
              <h2 className={styles.sectionTitle}>Глобальний Редактор Шаблонів Метаданих</h2>
              <p style={{ marginBottom: "20px", lineHeight: 1.5, color: "#9ca3af" }}>
                Тут ви можете налаштувати загальні шаблони генерації метаданих для цілих класів сторінок.
              </p>

              <div className={styles.simulatorGrid}>
                {/* Form fields */}
                <div>
                  <div className={styles.controlGroup} style={{ marginBottom: "24px" }}>
                    <label>Оберіть групу сторінок (Шаблон)</label>
                    <select
                      className={styles.select}
                      value={selectedTemplateKey}
                      onChange={(e) => setSelectedTemplateKey(e.target.value)}
                    >
                      <option value="home">Головна сторінка та міські хаби (home)</option>
                      <option value="prices">Сторінки цін (prices)</option>
                      <option value="faq">Сторінки FAQ (faq)</option>
                      <option value="portfolio">Сторінки Портфоліо (portfolio)</option>
                      <option value="contacts">Сторінки Контактів (contacts)</option>
                      <option value="about">Сторінка Про компанію (about)</option>
                      <option value="blog">Блог (blog)</option>
                      <option value="service">Загальний шаблон усіх послуг (fallback service)</option>
                      <option value="room">Загальний шаблон усіх кімнат/приміщень (fallback room)</option>
                      <optgroup label="Окремі послуги">
                        {servicesList.map((service) => (
                          <option key={service.slug} value={service.slug}>
                            Послуга: {service.uk?.title} ({service.slug})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* UK Template */}
                  <div className={styles.editorCard} style={{ marginTop: 0, marginBottom: "24px" }}>
                    <div className={styles.editorTitle}>
                      <span>🇺🇦</span> Українська версія (UK)
                    </div>
                    <div className={styles.editorForm}>
                      <div className={styles.editorGroup}>
                        <label>Шаблон Title</label>
                        <input
                          type="text"
                          className={styles.inputMeta}
                          value={templateTitleUk}
                          onChange={(e) => setTemplateTitleUk(e.target.value)}
                          placeholder="Наприклад: Натяжні стелі {cityPhrase} — ціна від бренду {siteName}"
                        />
                      </div>
                      <div className={styles.editorGroup}>
                        <label>Шаблон Description</label>
                        <textarea
                          className={styles.textareaMeta}
                          value={templateDescUk}
                          onChange={(e) => setTemplateDescUk(e.target.value)}
                          placeholder="Введіть шаблон опису..."
                        />
                      </div>
                      <button
                        onClick={() => handleSaveTemplates("uk")}
                        disabled={isSavingTemplates}
                        className={styles.saveBtn}
                      >
                        {isSavingTemplates ? "Збереження..." : "💾 Зберегти шаблон (UK)"}
                      </button>
                    </div>
                  </div>

                  {/* RU Template */}
                  <div className={styles.editorCard} style={{ marginTop: 0 }}>
                    <div className={styles.editorTitle}>
                      <span>🇷🇺</span> Російська версія (RU)
                    </div>
                    <div className={styles.editorForm}>
                      <div className={styles.editorGroup}>
                        <label>Шаблон Title</label>
                        <input
                          type="text"
                          className={styles.inputMeta}
                          value={templateTitleRu}
                          onChange={(e) => setTemplateTitleRu(e.target.value)}
                          placeholder="Наприклад: Натяжные потолки {cityPhrase} — цена от {siteName}"
                        />
                      </div>
                      <div className={styles.editorGroup}>
                        <label>Шаблон Description</label>
                        <textarea
                          className={styles.textareaMeta}
                          value={templateDescRu}
                          onChange={(e) => setTemplateDescRu(e.target.value)}
                          placeholder="Введіть шаблон опису..."
                        />
                      </div>
                      <button
                        onClick={() => handleSaveTemplates("ru")}
                        disabled={isSavingTemplates}
                        className={styles.saveBtn}
                      >
                        {isSavingTemplates ? "Збереження..." : "💾 Зберегти шаблон (RU)"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Template variables reference helper */}
                <div>
                  <div className={styles.auditCard}>
                    <div className={styles.auditSectionTitle} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", marginBottom: "15px" }}>
                      💡 Доступні плейсхолдери
                    </div>
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.4, color: "#9ca3af", marginBottom: "15px" }}>
                      Ви можете використовувати ці змінні у своїх шаблонах. Вони автоматично заміняться на реальні значення при генерації сторінки:
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <code style={{ color: "#ffd700", fontWeight: "bold" }}>{"{city}"}</code>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Назва міста в потрібній локалі (Київ / Киев)</div>
                      </div>
                      <div>
                        <code style={{ color: "#ffd700", fontWeight: "bold" }}>{"{cityPhrase}"}</code>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Прийменниковий відмінок (у Києві / в Киеве)</div>
                      </div>
                      <div>
                        <code style={{ color: "#ffd700", fontWeight: "bold" }}>{"{cityPhone}"}</code>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Локальний телефон офісу у вибраному місті</div>
                      </div>
                      <div>
                        <code style={{ color: "#ffd700", fontWeight: "bold" }}>{"{service}"}</code>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Назва послуги в потрібній локалі (Матові натяжні стелі)</div>
                      </div>
                      <div>
                        <code style={{ color: "#ffd700", fontWeight: "bold" }}>{"{siteName}"}</code>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Назва вашого бренду (NOVA STELYA)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div>
              <div className={styles.auditHeader}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 0, borderBottom: "none" }}>
                  Масовий SEO Аудит
                </h2>
                <button
                  onClick={runBulkAudit}
                  disabled={auditRunning}
                  className={styles.runBtn}
                >
                  {auditRunning ? `Аудит (${auditProgress}%)` : "Запустити аудит"}
                </button>
              </div>

              {auditResults.length > 0 && (
                <>
                  <div className={styles.auditSummary}>
                    <div className={`${styles.summaryItem} ${styles.summaryItemOk}`}>
                      <strong>{auditSummary.ok}</strong> оптимізовано
                    </div>
                    <div className={`${styles.summaryItem} ${styles.summaryItemWarn}`}>
                      <strong>{auditSummary.warn}</strong> попереджень
                    </div>
                    <div className={`${styles.summaryItem} ${styles.summaryItemError}`}>
                      <strong>{auditSummary.error}</strong> помилок
                    </div>
                  </div>

                  <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Язик</th>
                          <th>Регіон</th>
                          <th>Сторінка</th>
                          <th>Бали</th>
                          <th>Статус</th>
                          <th>Звіт по факторах</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditResults.map((res) => (
                          <tr key={res.id}>
                            <td><span style={{ textTransform: "uppercase" }}>{res.locale}</span></td>
                            <td>{res.city}</td>
                            <td><code>{res.page}</code></td>
                            <td><strong>{res.score}</strong></td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  res.status === "OK"
                                    ? styles.statusOk
                                    : res.status === "WARNING"
                                    ? styles.statusWarn
                                    : styles.statusError
                                }`}
                              >
                                {res.status}
                              </span>
                            </td>
                            <td style={{ color: res.status === "ERROR" ? "#fca5a5" : res.status === "WARNING" ? "#fde047" : "#9ca3af", fontSize: "0.85rem" }}>
                              {res.issues}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
