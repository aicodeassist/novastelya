"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { activeCities } from "@/config/geo-matrix";
import { Button, Input } from "@/components/ui";
import styles from "./Calculator.module.css";

type CalculatorProps = {
  defaultCitySlug?: string | null;
  locale: "uk" | "ru";
  defaultRoom?: string | null;
  defaultMaterial?: string | null;
  defaultTech?: string | null;
  defaultLights?: Record<string, number> | null;
  defaultColor?: string | null;
};

const ROOMS = [
  {
    id: "living",
    coef: 1,
    uk: { title: "Вітальня", meta: "Преміум рішення" },
    ru: { title: "Гостиная", meta: "Премиум решение" }
  },
  {
    id: "bedroom",
    coef: 1,
    uk: { title: "Спальня", meta: "Акустика · зіркове небо" },
    ru: { title: "Спальня", meta: "Акустика · звездное небо" }
  },
  {
    id: "kitchen",
    coef: 1.05,
    uk: { title: "Куня", meta: "Антистатик · +5%" },
    ru: { title: "Кухня", meta: "Антистатик · +5%" }
  },
  {
    id: "bathroom",
    coef: 1.1,
    uk: { title: "Ванна", meta: "Вологостійке · +10%" },
    ru: { title: "Ванная", meta: "Влагостойкое · +10%" }
  },
  {
    id: "kids",
    coef: 1.05,
    uk: { title: "Дитяча", meta: "Еко-полотно" },
    ru: { title: "Детская", meta: "Эко-полотно" }
  },
  {
    id: "hall",
    coef: 0.95,
    uk: { title: "Коридор", meta: "Компактне · −5%" },
    ru: { title: "Коридор", meta: "Компактное · −5%" }
  },
  {
    id: "office",
    coef: 1.15,
    uk: { title: "Офіс", meta: "Комерція · +15%" },
    ru: { title: "Офис", meta: "Коммерция · +15%" }
  }
];

const MATERIALS = [
  {
    id: "matte",
    price: 450,
    uk: { title: "Матове", meta: "MSD Premium · 450 ₴/м²", tooltip: "Класична матова фактура без відблисків. Ідеально рівна поверхня, що виглядає як якісна штукатурка." },
    ru: { title: "Матовое", meta: "MSD Premium · 450 ₴/м²", tooltip: "Классическая матовая фактура без бликов. Идеально ровная поверхность, выглядящая как качественная штукатурка." }
  },
  {
    id: "satin",
    price: 500,
    uk: { title: "Сатин", meta: "MSD Premium · 500 ₴/м²", tooltip: "Ніжна перламутрова фактура з легким світловідбиванням. Створює м'який затишний ефект в кімнаті." },
    ru: { title: "Сатин", meta: "MSD Premium · 500 ₴/м²", tooltip: "Нежная перламутровая фактура с легким светоотражением. Создает мягкий уютный эффект в комнате." }
  },
  {
    id: "glossy",
    price: 550,
    uk: { title: "Глянцеве", meta: "Pongs DE · 550 ₴/м²", tooltip: "Дзеркальна фактура, яка візуально збільшує простір та висоту стелі. Рекомендується для невеликих кімнат." },
    ru: { title: "Глянцевое", meta: "Pongs DE · 550 ₴/м²", tooltip: "Зеркальная фактура, визуально увеличивающая пространство и высоту потолка. Рекомендуется для небольших комнат." }
  },
  {
    id: "fabric",
    price: 1200,
    uk: { title: "Тканинне", meta: "Descor · 1200 ₴/м²", tooltip: "Преміальне безшовне дихаюче полотно на тканинній основі. Екологічно чисте, міцне, встановлюється без нагріву." },
    ru: { title: "Тканевое", meta: "Descor · 1200 ₴/м²", tooltip: "Премиальное бесшовное дышащее полотно на тканевой основе. Экологически чистое, прочное, устанавливается без нагрева." }
  },
  {
    id: "acoustic",
    price: 1400,
    uk: { title: "Акустичне", meta: "Clipso · 1400 ₴/м²", tooltip: "Полотно з мікроперфорацією, що поглинає шум та відлуння. Покращує акустичний комфорт у спальнях та домашніх кінотеатрах." },
    ru: { title: "Акустическое", meta: "Clipso · 1400 ₴/м²", tooltip: "Полотно с микроперфорацией, поглощающее шум и эхо. Улучшает акустический комфорт в спальнях и домашних кинотеатрах." }
  },
  {
    id: "translucent",
    price: 900,
    uk: { title: "Напівпрозоре", meta: "Для підсвічування · 900 ₴/м²", tooltip: "Пропускає до 50% світла. Використовується для створення повністю світлових стель або ефекту зоряного неба." },
    ru: { title: "Полупрозрачное", meta: "Для подсветки · 900 ₴/м²", tooltip: "Пропускает до 50% света. Используется для создания полностью световых потолков или эффекта звездного неба." }
  }
];

const TECHNOLOGY = [
  {
    id: "standard",
    price: 0,
    uk: { title: "Стандарт", meta: "ПВХ багет + вставка", tooltip: "Класичний монтаж. Технологічний зазор закривається декоративною м'якою маскуючою стрічкою (вставкою) по периметру." },
    ru: { title: "Стандарт", meta: "ПВХ багет + вставка", tooltip: "Классический монтаж. Технологический зазор закрывается декоративной мягкой маскирующей лентой (вставкой) по периметру." }
  },
  {
    id: "shadow",
    price: 280,
    uk: { title: "Тіньовий", meta: "Eurokraab · +280 ₴/м.п", tooltip: "Преміальний профіль Eurokraab, що створює ефект стелі, яка левітує, з рівним тіньовим швом 6 мм замість гумового плінтуса." },
    ru: { title: "Теневой", meta: "Eurokraab · +280 ₴/м.п", tooltip: "Премиальный профиль Eurokraab, создающий эффект левитирующего потолка с ровным теневым швом 6 мм вместо резинового плинтуса." }
  },
  {
    id: "floating",
    price: 350,
    uk: { title: "Парящий", meta: "LED по периметру · +350 ₴/м.п", tooltip: "Профіль з нішею для світлодіодної стрічки. М'яке світло спрямоване вздовж стіни, створює візуальний ефект ширяння стелі." },
    ru: { title: "Парящий", meta: "LED по периметру · +350 ₴/м.п", tooltip: "Профиль с нишей для светодиодной ленты. Мягкий свет направлен вдоль стены, создает визуальный эффект парения потолка." }
  },
  {
    id: "slotted",
    price: 420,
    uk: { title: "Щілинний", meta: "Nivel 15 · +420 ₴/м.п", tooltip: "Безщілинна система Nivel. Полотно ідеально прилягає до стіни без жодних проміжків, гумових вставок чи видимих стиків." },
    ru: { title: "Нишевый", meta: "Nivel 15 · +420 ₴/м.п", tooltip: "Бесщелевая система Nivel. Полотно идеально прилегает к стене без каких-либо зазоров, резиновых вставок или видимых стыков." }
  },
  {
    id: "double",
    price: 850,
    uk: { title: "Дворівневий", meta: "Перепад висот · +850 ₴/м.п", tooltip: "Створення геометричних багаторівневих конструкцій з алюмінієвого профілю з рівним перепадом висот та підсвічуванням." },
    ru: { title: "Двухуровневый", meta: "Перепад высот · +850 ₴/м.п", tooltip: "Создание геометрических многоуровневых конструкций из алюминиевого профиля с ровным перепадом высот и подсветкой." }
  },
  {
    id: "carved",
    price: 1200,
    uk: { title: "Різьблений", meta: "Apply · +1200 ₴/м²", tooltip: "Технологія перфорованих стель Apply. Два полотна (цільне фонове та художньо вирізане нижнє) створюють 3D об'єм." },
    ru: { title: "Резной", meta: "Apply · +1200 ₴/м²", tooltip: "Технология перфорированных потолков Apply. Два полотна (цельное фоновое и художественно вырезанное нижнее) создают 3D объем." }
  }
];

const COLOR = [
  {
    id: "white",
    price: 0,
    uk: { title: "Білий", meta: "RAL 9016 · базова ціна", tooltip: "Ідеально біла стеля. Найпопулярніший вибір для скандинавського стилю, мінімалізму та класики." },
    ru: { title: "Белый", meta: "RAL 9016 · базовая цена", tooltip: "Идеально белый потолок. Самый популярный выбор для скандинавского стиля, минимализма и классики." }
  },
  {
    id: "colored",
    price: 80,
    uk: { title: "Кольоровий", meta: "240+ RAL · +80 ₴/м²", tooltip: "Будь-який відтінок з палітри 240+ кольорів. Підбирається індивідуально под колір стін чи меблів." },
    ru: { title: "Цветной", meta: "240+ RAL · +80 ₴/м²", tooltip: "Любой оттенок из палитры 240+ цветов. Подбирается индивидуально под цвет стен или мебели." }
  },
  {
    id: "black",
    price: 120,
    uk: { title: "Чорний глянець", meta: "Дзеркальний ефект · +120 ₴/м²", tooltip: "Створює приголомшве глибоке відображення. Візуально подвоює висоту кімнати, виглядає суперсучасно." },
    ru: { title: "Черный глянец", meta: "Зеркальный эффект · +120 ₴/м²", tooltip: "Создает потрясающее глубокое отражение. Визуально удваивает высоту комнаты, выглядит суперсовременно." }
  },
  {
    id: "print",
    price: 450,
    uk: { title: "Фотодрук", meta: "Екосольвент · +450 ₴/м²", tooltip: "Художній друк на полотні екологічно чистими фарбами. Небо з хмарами, абстракції або будь-які малюнки." },
    ru: { title: "Фотопечать", meta: "Экосольвент · +450 ₴/м²", tooltip: "Художественная печать на полотне экологически чистыми красками. Небо с облаками, абстракции или любые рисунки." }
  },
  {
    id: "texture",
    price: 350,
    uk: { title: "Текстура", meta: "Мармур · дерево · +350 ₴/м²", tooltip: "Стелі з імітацією натуральних текстур: мармур, шкіра, бетон, замша або дерево для ексклюзивного інтер'єру." },
    ru: { title: "Текстура", meta: "Мрамор · дерево · +350 ₴/м²", tooltip: "Потолки с имитацией натуральных текстур: мрамор, кожа, бетон, замша или дерево для эксклюзивного интерьера." }
  },
  {
    id: "starry",
    price: 2500,
    uk: { title: "Зоряне небо", meta: "Оптоволокно · +2500 ₴/м²", tooltip: "Ефект справжнього нічного неба. Оптоволоконні нитки світяться, мерехтять та створюють падаючі зірки." },
    ru: { title: "Звездное небо", meta: "Оптоволокно · +2500 ₴/м²", tooltip: "Эффект настоящего ночного неба. Оптоволоконные нити светятся, мерцают и воссоздают падающие звезды." }
  }
];

const LIGHTS = [
  {
    id: "chandelier",
    price: 350,
    max: 10,
    uk: { title: "Люстра (гакова / стельова)", desc: "Монтаж платформи та закладної · 350 ₴/шт", unit: "шт" },
    ru: { title: "Люстра (крючковая / потолочная)", desc: "Монтаж платформы и закладной · 350 ₴/шт", unit: "шт" }
  },
  {
    id: "spot",
    price: 280,
    max: 40,
    uk: { title: "Точкові світильники", desc: "Врізні LED, платформа · 280 ₴/шт", unit: "шт" },
    ru: { title: "Точечные светильники", desc: "Врезные LED, платформа · 280 ₴/шт", unit: "шт" }
  },
  {
    id: "track",
    price: 550,
    max: 20,
    uk: { title: "Трекові системи (магнітні)", desc: "Вбудовані в полотно · 550 ₴/м.п", unit: "м.п" },
    ru: { title: "Трековые системы (магнитные)", desc: "Встроенные в полотно · 550 ₴/м.п", unit: "м.п" }
  },
  {
    id: "line",
    price: 800,
    max: 30,
    uk: { title: "Світлові лінії", desc: "LED-стрічка в профілі · 800 ₴/м.п", unit: "м.п" },
    ru: { title: "Световые линии", desc: "LED-лента в профиле · 800 ₴/м.п", unit: "м.п" }
  },
  {
    id: "backlight",
    price: 650,
    max: 30,
    uk: { title: "Контурне підсвічування", desc: "LED за полотном · 650 ₴/м.п", unit: "м.п" },
    ru: { title: "Контурная подсветка", desc: "LED за полотном · 650 ₴/м.п", unit: "м.п" }
  },
  {
    id: "starry",
    price: 2500,
    max: 30,
    uk: { title: "Зоряне небо (оптоволокно)", desc: "120–300 точок/м² · 2500 ₴/м²", unit: "м²" },
    ru: { title: "Звездное небо (оптоволокно)", desc: "120–300 точек/м² · 2500 ₴/м²", unit: "м²" }
  }
];

const EXTRA_SERVICES_QTY = [
  {
    id: "pipe",
    price: 250,
    max: 6,
    uk: { title: "Обхід труби", desc: "250 ₴/шт" },
    ru: { title: "Обход трубы", desc: "250 ₴/шт" }
  },
  {
    id: "vent",
    price: 450,
    max: 6,
    uk: { title: "Вентиляційна решітка", desc: "Врізка в полотно · 450 ₴/шт" },
    ru: { title: "Вентиляционная решетка", desc: "Врезка в полотно · 450 ₴/шт" }
  },
  {
    id: "curtain",
    price: 420,
    max: 10,
    uk: { title: "Прихований карніз", desc: "Ніша під штори · 420 ₴/м.п" },
    ru: { title: "Скрытый карниз", desc: "Ниша под шторы · 420 ₴/м.п" }
  }
];

const EXTRA_SERVICES_BOOL = [
  {
    id: "dismantle",
    price: 120,
    uk: { title: "Демонтаж старої стелі", desc: "120 ₴/м²" },
    ru: { title: "Демонтаж старого потолка", desc: "120 ₴/м²" }
  },
  {
    id: "wiring",
    price: 2500,
    uk: { title: "Електророзводка", desc: "Повний монтаж кабель-каналів · 2500 ₴" },
    ru: { title: "Электроразводка", desc: "Полный монтаж кабель-каналов · 2500 ₴" }
  },
  {
    id: "design",
    price: 3500,
    uk: { title: "3D-візуалізація проєкту", desc: "Індивідуальний дизайн · 3500 ₴" },
    ru: { title: "3D-визуализация проекта", desc: "Индивидуальный дизайн · 3500 ₴" }
  }
];

export function Calculator({
  defaultCitySlug,
  locale,
  defaultRoom,
  defaultMaterial,
  defaultTech,
  defaultLights,
  defaultColor,
}: CalculatorProps) {
  const isUk = locale === "uk";
  const [step, setStep] = useState(1);
  const [room, setRoom] = useState(defaultRoom || ROOMS[0].id);
  const [area, setArea] = useState(20);
  const [perimeter, setPerimeter] = useState(18);
  const [corners, setCorners] = useState(4);
  const [height, setHeight] = useState(2.7);
  const [material, setMaterial] = useState(defaultMaterial || MATERIALS[0].id);
  const [tech, setTech] = useState(defaultTech || TECHNOLOGY[0].id);
  const [color, setColor] = useState(defaultColor || COLOR[0].id);

  const [lights, setLights] = useState<Record<string, number>>(() => {
    const initial = {
      chandelier: 0,
      spot: 0,
      track: 0,
      line: 0,
      backlight: 0,
      starry: 0,
    };
    if (defaultLights) {
      Object.keys(defaultLights).forEach((k) => {
        if (k in initial) {
          initial[k as keyof typeof initial] = defaultLights[k];
        }
      });
    }
    return initial;
  });

  const [extra, setExtra] = useState<Record<string, number>>({
    pipe: 0,
    vent: 0,
    curtain: 0,
    dismantle: 0,
    wiring: 0,
    design: 0,
  });

  const [citySlug, setCitySlug] = useState(defaultCitySlug || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Global click to dismiss active tooltips on tap (mobile)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.tooltipContainer}`)) {
        return;
      }
      setOpenTooltip(null);
    };
    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  const totals = useMemo(() => {
    const activeRoomObj = ROOMS.find((r) => r.id === room);
    const roomCoef = activeRoomObj ? activeRoomObj.coef : 1;

    const activeMaterialObj = MATERIALS.find((m) => m.id === material);
    const materialCost = area * (activeMaterialObj ? activeMaterialObj.price : 0) * roomCoef;

    const activeTechObj = TECHNOLOGY.find((t) => t.id === tech);
    const techPrice = activeTechObj ? activeTechObj.price : 0;
    const techCost = tech === "carved" ? area * techPrice : perimeter * techPrice;

    const activeColorObj = COLOR.find((c) => c.id === color);
    const colorCost = area * (activeColorObj ? activeColorObj.price : 0);

    let lightCost = 0;
    Object.keys(lights).forEach((lightId) => {
      const count = lights[lightId] || 0;
      const config = LIGHTS.find((l) => l.id === lightId);
      const price = config ? config.price : 0;
      lightCost += count * price;
    });

    let extraCost = 0;
    Object.keys(extra).forEach((extraId) => {
      const countOrBool = extra[extraId] || 0;
      const qtyConfig = EXTRA_SERVICES_QTY.find((e) => e.id === extraId);
      const boolConfig = EXTRA_SERVICES_BOOL.find((e) => e.id === extraId);
      const price = qtyConfig ? qtyConfig.price : boolConfig ? boolConfig.price : 0;
      if (extraId === "dismantle") {
        extraCost += countOrBool * price * area;
      } else {
        extraCost += countOrBool * price;
      }
    });

    let heightSurcharge = 0;
    if (height > 3) {
      heightSurcharge = (materialCost + techCost) * 0.15;
    }

    const baseTotal = materialCost + techCost + colorCost + lightCost + extraCost + heightSurcharge;

    const activeCity = activeCities.find((c) => c.slug === citySlug);
    const cityModifier = activeCity ? activeCity.priceModifier : 1.0;

    return {
      materialCost: Math.round(materialCost * cityModifier),
      techCost: Math.round(techCost * cityModifier),
      colorCost: Math.round(colorCost * cityModifier),
      lightCost: Math.round(lightCost * cityModifier),
      extraCost: Math.round(extraCost * cityModifier),
      heightSurcharge: Math.round(heightSurcharge * cityModifier),
      total: Math.round(baseTotal * cityModifier),
    };
  }, [room, area, perimeter, material, tech, color, lights, extra, height, citySlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+38\s\(0\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(phone)) {
      setPhoneError(isUk ? "Невірний формат телефону" : "Неверный формат телефона");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    setIsSuccess(false);

    try {
      const activeRoom = ROOMS.find((r) => r.id === room);
      const activeMaterial = MATERIALS.find((m) => m.id === material);
      const activeTech = TECHNOLOGY.find((t) => t.id === tech);
      const activeColor = COLOR.find((c) => c.id === color);

      const lightsDetails = Object.entries(lights)
        .filter(([_, count]) => count > 0)
        .map(([lightId, count]) => {
          const config = LIGHTS.find((l) => l.id === lightId);
          return `${config ? config[locale].title : lightId} x${count}`;
        })
        .join(", ");

      const extraDetails = Object.entries(extra)
        .filter(([_, countOrBool]) => countOrBool > 0)
        .map(([extraId, countOrBool]) => {
          const qtyConfig = EXTRA_SERVICES_QTY.find((e) => e.id === extraId);
          const boolConfig = EXTRA_SERVICES_BOOL.find((e) => e.id === extraId);
          const title = qtyConfig ? qtyConfig[locale].title : boolConfig ? boolConfig[locale].title : extraId;
          return qtyConfig ? `${title} x${countOrBool}` : title;
        })
        .join(", ");

      const messageContent = `
        Кімната: ${activeRoom ? activeRoom[locale].title : room}
        Площа: ${area} м², Периметр: ${perimeter} м, Кутів: ${corners}, Висота: ${height} м
        Матеріал: ${activeMaterial ? activeMaterial[locale].title : material}
        Технологія: ${activeTech ? activeTech[locale].title : tech}
        Декор: ${activeColor ? activeColor[locale].title : color}
        Освітлення: ${lightsDetails || "немає"}
        Додатково: ${extraDetails || "немає"}
      `;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          city: citySlug || "ukraine",
          service: material,
          area,
          totalPrice: totals.total,
          message: messageContent,
        }),
      });

      if (!response.ok) throw new Error("Submit error");
      setIsSuccess(true);
      setName("");
      setPhone("");
    } catch (err) {
      setSubmitError(isUk ? "Помилка відправки. Спробуйте пізніше." : "Ошибка отправки. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTooltip = (item: any) => {
    if (!item[locale].tooltip) return null;
    const isOpened = openTooltip === item.id;
    return (
      <span
        className={`${styles.tooltipContainer} ${isOpened ? styles.tooltipContainerActive : ""}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseEnter={() => {
          if (window.innerWidth > 960) {
            setOpenTooltip(item.id);
          }
        }}
        onMouseLeave={() => {
          if (window.innerWidth > 960) {
            setOpenTooltip(null);
          }
        }}
      >
        <span
          role="button"
          tabIndex={0}
          className={styles.tooltipBtn}
          onClick={(e) => {
            e.stopPropagation();
            setOpenTooltip(isOpened ? null : item.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setOpenTooltip(isOpened ? null : item.id);
            }
          }}
          aria-label={isUk ? "Детальніше" : "Подробнее"}
        >
          ?
        </span>
        {isOpened && (
          <span className={styles.tooltipBox}>
            {item[locale].tooltip}
          </span>
        )}
      </span>
    );
  };

  const activeRoomObj = ROOMS.find((r) => r.id === room);
  const activeMaterialObj = MATERIALS.find((m) => m.id === material);
  const activeTechObj = TECHNOLOGY.find((t) => t.id === tech);
  const activeColorObj = COLOR.find((c) => c.id === color);

  return (
    <div className={styles.calculator} id="calculator">
      <div className={styles.calcWrap}>
        <div className={styles.calcMain}>
          {/* Progress dots */}
          <div className={styles.calcProgress} role="progressbar" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step}>
            {Array.from({ length: 7 }).map((_, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < step;
              const isActive = stepNum === step;
              const dotClass = [
                styles.calcStepDot,
                isDone ? styles.done : "",
                isActive ? styles.active : "",
              ].filter(Boolean).join(" ");

              return (
                <button
                  key={stepNum}
                  type="button"
                  className={dotClass}
                  onClick={() => setStep(stepNum)}
                  aria-label={isUk ? `Крок ${stepNum}` : `Шаг ${stepNum}`}
                />
              );
            })}
          </div>

          {/* STEP 1: Room Type */}
          {step === 1 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 1 з 7" : "Шаг 1 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Тип приміщення" : "Тип помещения"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk ? "Оберіть кімнату — це впливає на вибір полотна та профілю." : "Выберите комнату — это влияет на выбор полотна и профиля."}
              </p>
              <div className={styles.optionGrid} role="radiogroup">
                {ROOMS.map((r) => {
                  const isSelected = room === r.id;
                  return (
                    <div
                      key={r.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                      onClick={() => {
                        setRoom(r.id);
                        if (r.id === "bathroom") {
                          setMaterial("translucent");
                          setTech("shadow");
                        } else if (r.id === "kitchen") {
                          setMaterial("matte");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setRoom(r.id);
                          if (r.id === "bathroom") {
                            setMaterial("translucent");
                            setTech("shadow");
                          } else if (r.id === "kitchen") {
                            setMaterial("matte");
                          }
                        }
                      }}
                    >
                      <span className={styles.optionCheck}></span>
                      <span className={styles.optionHeader}>
                        <span className={styles.optionTitle}>{r[locale].title}</span>
                      </span>
                      <span className={styles.optionMeta}>{r[locale].meta}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Geometry */}
          {step === 2 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 2 з 7" : "Шаг 2 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Геометрія приміщення" : "Геометрия помещения"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk
                  ? "Введіть параметри кімнати. Якщо не знаєте точних значень — використайте середні."
                  : "Введите параметры комнаты. Если не знаете точных значений — используйте средние."}
              </p>
              <div className={styles.stack}>
                <div className={styles.rangeWrap}>
                  <div className={styles.rangeValue}>
                    <div>
                      {isUk ? "Площа стелі" : "Площадь потолка"}{" "}
                      <span>м²</span>
                    </div>
                    <strong>{area}</strong>
                  </div>
                  <input
                    type="range"
                    className={styles.range}
                    min="4"
                    max="100"
                    value={area}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setArea(val);
                      setPerimeter(Math.round(4 * Math.sqrt(val) * 10) / 10);
                    }}
                  />
                  <div className={styles.rangeLabels}>
                    <span>4 м²</span>
                    <span>100 м²</span>
                  </div>
                </div>

                <div className={styles.rangeWrap}>
                  <div className={styles.rangeValue}>
                    <div>
                      {isUk ? "Периметр" : "Периметр"}{" "}
                      <span>м.п.</span>
                    </div>
                    <strong>{perimeter}</strong>
                  </div>
                  <input
                    type="range"
                    className={styles.range}
                    min="6"
                    max="60"
                    value={perimeter}
                    step="0.5"
                    onChange={(e) => setPerimeter(parseFloat(e.target.value))}
                  />
                  <div className={styles.rangeLabels}>
                    <span>6 м.п.</span>
                    <span>60 м.п.</span>
                  </div>
                </div>

                <div className={styles.rangeWrap}>
                  <div className={styles.rangeValue}>
                    <div>{isUk ? "Кількість кутів" : "Количество углов"}</div>
                    <strong>{corners}</strong>
                  </div>
                  <input
                    type="range"
                    className={styles.range}
                    min="3"
                    max="20"
                    value={corners}
                    onChange={(e) => setCorners(parseInt(e.target.value))}
                  />
                  <div className={styles.rangeLabels}>
                    <span>3</span>
                    <span>20</span>
                  </div>
                </div>

                <div className={styles.rangeWrap}>
                  <div className={styles.rangeValue}>
                    <div>
                      {isUk ? "Висота стелі" : "Высота потолка"}{" "}
                      <span>м</span>
                    </div>
                    <strong>{height.toFixed(1)}</strong>
                  </div>
                  <input
                    type="range"
                    className={styles.range}
                    min="2.4"
                    max="4.5"
                    value={height}
                    step="0.1"
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                  />
                  <div className={styles.rangeLabels}>
                    <span>2.4 м</span>
                    <span>4.5 м</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Material */}
          {step === 3 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 3 з 7" : "Шаг 3 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Вид полотна" : "Вид полотна"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk ? "Обираємо матеріал за візуальним ефектом, експлуатаційними властивостями та бюджетом." : "Выбираем материал по визуальному эффекту, эксплуатационным свойствам и бюджету."}
              </p>
              <div className={styles.optionGrid} role="radiogroup">
                {MATERIALS.map((m) => {
                  const isSelected = material === m.id;
                  return (
                    <div
                      key={m.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                      onClick={() => setMaterial(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setMaterial(m.id);
                        }
                      }}
                    >
                      <span className={styles.optionCheck}></span>
                      <span className={styles.optionHeader}>
                        <span className={styles.optionTitle}>
                          {m[locale].title}
                          {renderTooltip(m)}
                        </span>
                      </span>
                      <span className={styles.optionMeta}>{m[locale].meta}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Technology */}
          {step === 4 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 4 з 7" : "Шаг 4 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Технологія монтажу" : "Технология монтажа"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk ? "Тип профілю визначає зовнішній вигляд стику стелі зі стіною та загальну архітектуру." : "Тип профиля определяет внешний вид стыка потолка со стеной и общую архитектуру."}
              </p>
              <div className={styles.optionGrid} role="radiogroup">
                {TECHNOLOGY.map((t) => {
                  const isSelected = tech === t.id;
                  return (
                    <div
                      key={t.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                      onClick={() => setTech(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setTech(t.id);
                        }
                      }}
                    >
                      <span className={styles.optionCheck}></span>
                      <span className={styles.optionHeader}>
                        <span className={styles.optionTitle}>
                          {t[locale].title}
                          {renderTooltip(t)}
                        </span>
                      </span>
                      <span className={styles.optionMeta}>{t[locale].meta}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Color */}
          {step === 5 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 5 з 7" : "Шаг 5 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Колір та декор" : "Цвет и декор"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk ? "Білий — класика для преміум інтер'єру. Кольорові та фактурні варіанти доступні у палітрі 240+ відтінків." : "Белый — классика для премиум интерьера. Цветные и фактурные варианты доступны в палитре 240+ оттенков."}
              </p>
              <div className={styles.optionGrid} role="radiogroup">
                {COLOR.map((c) => {
                  const isSelected = color === c.id;
                  return (
                    <div
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                      onClick={() => setColor(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setColor(c.id);
                        }
                      }}
                    >
                      <span className={styles.optionCheck}></span>
                      <span className={styles.optionHeader}>
                        <span className={styles.optionTitle}>
                          {c[locale].title}
                          {renderTooltip(c)}
                        </span>
                      </span>
                      <span className={styles.optionMeta}>{c[locale].meta}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Lighting */}
          {step === 6 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 6 з 7" : "Шаг 6 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Освітлення" : "Освещение"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk ? "Оберіть сценарії світла. Можна комбінувати кілька варіантів — кожен додається до загальної суми." : "Выберите сценарии света. Можно комбинировать несколько вариантов — каждый добавляется к общей сумме."}
              </p>
              <div className={styles.stackToggle}>
                {LIGHTS.map((l) => (
                  <div key={l.id} className={styles.toggleRow}>
                    <div className={styles.toggleRowInfo}>
                      <strong>{l[locale].title}</strong>
                      <span>{l[locale].desc}</span>
                    </div>
                    <div className={styles.toggleRowRight}>
                      <div className={styles.qtyInput}>
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.max(0, (lights[l.id] || 0) - 1);
                            setLights({ ...lights, [l.id]: val });
                          }}
                        >
                          −
                        </button>
                        <input type="number" value={lights[l.id] || 0} readOnly />
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.min(l.max, (lights[l.id] || 0) + 1);
                            setLights({ ...lights, [l.id]: val });
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Extra & Lead capture */}
          {step === 7 && (
            <div className={styles.calcStep}>
              <div className={styles.calcStepNum}>{isUk ? "Крок 7 з 7" : "Шаг 7 из 7"}</div>
              <h3 className={styles.calcStepTitle}>{isUk ? "Додаткові роботи" : "Дополнительные работы"}</h3>
              <p className={styles.calcStepDesc}>
                {isUk ? "Активуйте лише те, що дійсно потрібно. Кожен пункт — це реальна послуга з фіксованою ціною." : "Активируйте только то, что действительно нужно. Каждый пункт — это реальная услуга с фиксированной ценой."}
              </p>
              <div className={styles.stackToggle}>
                {EXTRA_SERVICES_QTY.map((eItem) => (
                  <div key={eItem.id} className={styles.toggleRow}>
                    <div className={styles.toggleRowInfo}>
                      <strong>{eItem[locale].title}</strong>
                      <span>{eItem[locale].desc}</span>
                    </div>
                    <div className={styles.toggleRowRight}>
                      <div className={styles.qtyInput}>
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.max(0, (extra[eItem.id] || 0) - 1);
                            setExtra({ ...extra, [eItem.id]: val });
                          }}
                        >
                          −
                        </button>
                        <input type="number" value={extra[eItem.id] || 0} readOnly />
                        <button
                          type="button"
                          onClick={() => {
                            const val = Math.min(eItem.max, (extra[eItem.id] || 0) + 1);
                            setExtra({ ...extra, [eItem.id]: val });
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {EXTRA_SERVICES_BOOL.map((eItem) => (
                  <div key={eItem.id} className={styles.toggleRow}>
                    <div className={styles.toggleRowInfo}>
                      <strong>{eItem[locale].title}</strong>
                      <span>{eItem[locale].desc}</span>
                    </div>
                    <div className={styles.toggleRowRight}>
                      <div className={styles.toggleRowRightWrapper}>
                        <span className={styles.toggleRowPrice}>
                          {eItem.price > 0 ? `+${eItem.price} ₴` : ""}
                        </span>
                        <button
                          type="button"
                          className={`${styles.switch} ${extra[eItem.id] ? styles.on : ""}`}
                          onClick={() => setExtra({ ...extra, [eItem.id]: extra[eItem.id] ? 0 : 1 })}
                          role="switch"
                          aria-checked={extra[eItem.id] === 1}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead capture form */}
              <div className={styles.leadFormContainer}>
                <h4 className={styles.leadFormTitle}>
                  {isUk ? "Зафіксуйте ціну зі знижкою 10%" : "Зафиксируйте цену со скидкой 10%"}
                </h4>
                {isSuccess ? (
                  <div className={styles.successMessage}>
                    🎉 {isUk ? "Заявку успішно відправлено! Ми зв'яжемося з вами." : "Заявка успешно отправлена! Мы свяжемся с вами."}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.leadForm}>
                    <div className={styles.leadFormRow}>
                      {/* Custom Select Dropdown for City */}
                      <div className={styles.customSelectContainer}>
                        <button
                          type="button"
                          className={styles.customSelectTrigger}
                          onClick={() => setIsSelectOpen(!isSelectOpen)}
                        >
                          <span>
                            {citySlug
                              ? activeCities.find((c) => c.slug === citySlug)?.[locale]
                              : (isUk ? "Оберіть місто (Вся Україна)" : "Выберите город (Вся Украина)")}
                          </span>
                          <svg
                            className={`${styles.selectChevron} ${isSelectOpen ? styles.selectChevronOpen : ""}`}
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        {isSelectOpen && (
                          <>
                            <div className={styles.selectBackdrop} onClick={() => setIsSelectOpen(false)} />
                            <ul className={styles.selectDropdown}>
                              <li
                                className={`${styles.selectOption} ${!citySlug ? styles.selectOptionActive : ""}`}
                                onClick={() => {
                                  setCitySlug("");
                                  setIsSelectOpen(false);
                                }}
                              >
                                {isUk ? "Оберіть місто (Вся Україна)" : "Выберите город (Вся Украина)"}
                              </li>
                              {activeCities.map((c) => (
                                <li
                                  key={c.slug}
                                  className={`${styles.selectOption} ${citySlug === c.slug ? styles.selectOptionActive : ""}`}
                                  onClick={() => {
                                    setCitySlug(c.slug);
                                    setIsSelectOpen(false);
                                  }}
                                >
                                  {c[locale]}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>

                      <Input
                        placeholder={isUk ? "Ваше ім'я" : "Ваше имя"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.leadInput}
                      />

                      <Input
                        placeholder="+38 (0__) ___-__-__"
                        value={phone}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (!val.startsWith("38") && val.length > 0) {
                            val = val.startsWith("0") ? "38" + val : "380" + val;
                          }
                          let formatted = "";
                          if (val.length > 0) formatted = "+38";
                          if (val.length > 2) formatted += ` (${val.substring(2, 5)}`;
                          if (val.length > 5) formatted += `) ${val.substring(5, 8)}`;
                          if (val.length > 8) formatted += `-${val.substring(8, 10)}`;
                          if (val.length > 10) formatted += `-${val.substring(10, 12)}`;
                          setPhone(formatted);
                          setPhoneError("");
                        }}
                        error={phoneError}
                        required
                        className={styles.leadInput}
                      />
                    </div>
                    {submitError && <span className={styles.formError}>{submitError}</span>}
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={isSubmitting}
                      className={styles.submitBtn}
                    >
                      {isSubmitting
                        ? (isUk ? "Відправка..." : "Отправка...")
                        : (isUk ? "Надіслати проект" : "Отправить проект")}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          )}

          <div className={styles.calcNav}>
            <button
              type="button"
              className={styles.btnPrev}
              onClick={() => {
                if (step > 1) setStep(step - 1);
              }}
              disabled={step === 1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {isUk ? "Назад" : "Назад"}
            </button>
            {step < 7 ? (
              <button
                type="button"
                className={styles.btnNext}
                onClick={() => {
                  if (step < 7) setStep(step + 1);
                }}
              >
                {isUk ? "Далі" : "Далее"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Sidebar Summary Panel */}
        <aside className={styles.calcSummary} aria-label={isUk ? "Підсумок розрахунку" : "Итог расчета"}>
          <div className={styles.calcSummaryHeader}>
            <div className={styles.calcSummaryLabel}>{isUk ? "Ваша конфігурація" : "Ваша конфигурация"}</div>
            <h4 id="calcTitle" className={styles.calcSummaryTitle}>
              {activeRoomObj ? activeRoomObj[locale].title : ""}
            </h4>
          </div>

          <button
            type="button"
            className={styles.summaryMobileToggle}
            onClick={() => setDetailsExpanded(!detailsExpanded)}
          >
            <span>{isUk ? "Деталі розрахунку" : "Детали расчета"}</span>
            <svg
              className={`${styles.chevron} ${detailsExpanded ? styles.chevronOpen : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <div className={`${styles.calcSummaryRows} ${detailsExpanded ? styles.expanded : ""}`}>
            {/* Row 1: Room */}
            <div
              className={`${styles.calcSummaryRow} ${step === 1 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(1);
                }
              }}
            >
              <span>{isUk ? "Приміщення" : "Помещение"}</span>
              <span className={styles.val}>{activeRoomObj ? activeRoomObj[locale].title : "—"}</span>
            </div>

            {/* Row 2: Geometry */}
            <div
              className={`${styles.calcSummaryRow} ${step === 2 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(2)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(2);
                }
              }}
            >
              <span>{isUk ? "Параметри" : "Параметры"}</span>
              <span className={styles.val}>
                {area} м² / {perimeter} м.п.
              </span>
            </div>

            {/* Row 3: Material */}
            <div
              className={`${styles.calcSummaryRow} ${step === 3 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(3)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(3);
                }
              }}
            >
              <span>{isUk ? "Матеріал" : "Материал"}</span>
              <span className={styles.val}>
                {activeMaterialObj ? `${activeMaterialObj[locale].title} · ${totals.materialCost} ₴` : "—"}
              </span>
            </div>

            {/* Row 4: Profile/Technology */}
            <div
              className={`${styles.calcSummaryRow} ${step === 4 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(4)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(4);
                }
              }}
            >
              <span>{isUk ? "Профіль" : "Профиль"}</span>
              <span className={styles.val}>
                {activeTechObj ? `${activeTechObj[locale].title} · ${totals.techCost} ₴` : "—"}
              </span>
            </div>

            {/* Row 5: Color */}
            <div
              className={`${styles.calcSummaryRow} ${step === 5 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(5)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(5);
                }
              }}
            >
              <span>{isUk ? "Колір" : "Цвет"}</span>
              <span className={styles.val}>
                {activeColorObj ? `${activeColorObj[locale].title} · ${totals.colorCost} ₴` : "—"}
              </span>
            </div>

            {/* Row 6: Lighting */}
            <div
              className={`${styles.calcSummaryRow} ${step === 6 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(6)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(6);
                }
              }}
            >
              <span>{isUk ? "Освітлення" : "Освещение"}</span>
              <span className={styles.val}>{totals.lightCost > 0 ? `${totals.lightCost} ₴` : "—"}</span>
            </div>

            {/* Row 7: Extra/Additional */}
            <div
              className={`${styles.calcSummaryRow} ${step === 7 ? styles.activeSummaryRow : ""}`}
              onClick={() => setStep(7)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setStep(7);
                }
              }}
            >
              <span>{isUk ? "Додатково" : "Дополнительно"}</span>
              <span className={styles.val}>{totals.extraCost > 0 ? `${totals.extraCost} ₴` : "—"}</span>
            </div>

            {/* Optional height surcharge display (tied to Step 2 parameter) */}
            {totals.heightSurcharge > 0 && (
              <div
                className={`${styles.calcSummaryRow} ${step === 2 ? styles.activeSummaryRow : ""}`}
                onClick={() => setStep(2)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setStep(2);
                  }
                }}
              >
                <span>{isUk ? "Висотна націнка (+15%)" : "Высотная наценка (+15%)"}</span>
                <span className={styles.val}>{totals.heightSurcharge} ₴</span>
              </div>
            )}
          </div>

          <div className={styles.calcSummaryTotal}>
            <div className={styles.calcSummaryTotalLabel}>{isUk ? "Кошторис" : "Смета"}</div>
            <div className={styles.calcSummaryTotalValue}>
              {totals.total.toLocaleString("uk-UA")} <span>₴</span>
            </div>
            <p className={styles.calcSummaryNote}>
              {isUk
                ? "*Ціна орієнтовна, включає матеріали та роботу. Точний розрахунок виконує замірник."
                : "*Цена ориентировочная, включает материалы и работу. Точный расчет делает замерщик."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}