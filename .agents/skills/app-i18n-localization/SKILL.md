---
name: app-i18n-localization
description: Guidelines and patterns for bilingual Swedish (sv) and English (en) localization, number/unit formatting, and culinary term translations in Cookaloo.
---

# Cookaloo Localization & Internationalization (i18n)

This skill outlines how to manage bilingual support (Swedish and English), measurement conversions, and localized culinary terminology.

---

## 1. Setup with Expo Localization & i18next

```bash
npx expo install expo-localization
npm install i18next react-i18next
```

### Configuration
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import sv from './locales/sv.json';

const resources = {
  en: { translation: en },
  sv: { translation: sv },
};

const userLocale = Localization.getLocales()[0]?.languageCode || 'sv';

i18n.use(initReactI18next).init({
  resources,
  lng: userLocale === 'sv' ? 'sv' : 'en',
  fallbackLng: 'sv',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

---

## 2. Swedish / English Culinary Dictionary

Standardized translations for grocery categories and recipe terms:

| English | Svenska | Category / Role |
| :--- | :--- | :--- |
| Recipes | Recept | Main Navigation |
| Import | Importera | Main Navigation |
| Shopping List | Inköpslista | Main Navigation |
| Household | Hushåll | Settings |
| Produce / Fruit & Veg | Grönsaker & Frukt | Grocery Aisle |
| Dairy | Mejeri | Grocery Aisle |
| Meat & Fish | Kött & Fisk | Grocery Aisle |
| Pantry | Skafferi | Grocery Aisle |
| Spices | Kryddor | Grocery Aisle |
| Bakery | Bröd & Bageri | Grocery Aisle |
| Servings / Portions | Portioner | Recipe Meta |
| Prep Time | Förberedelse | Recipe Meta |
| Cook Time | Tillagning | Recipe Meta |
| Tried | Provat | Status Badge |
| Cooked Today | Vi lagade den idag | Action Button |

---

## 3. Localized Unit Formatting

- Use Swedish comma as decimal separator when in Swedish (`1,5 dl` vs `1.5 dl`).
- Unit choice has two options: **Metriskt | US** (EN: Metric | US), set in Settings and as a quick toggle on the recipe view.
  - Metriskt + Swedish UI → dl, msk, tsk, krm, g, kg, l.
  - Metriskt + English UI → ml, l, g, kg.
  - US → cups, tbsp, tsp, oz, lb, °F.
- Never use the label "Imperial" (it means UK measures). Approximate conversions are shown with "≈".
- Grocery aisles also include **Fryst / Frozen** and **Övrigt / Other**.
