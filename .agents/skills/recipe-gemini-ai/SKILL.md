---
name: recipe-gemini-ai
description: Guide for building AI-powered recipe extraction, multimodal image OCR, web URL parsing, portion scaling, and metric/imperial conversions using the Google Gemini API (@google/genai).
---

# Recipe AI Extraction & Multimodal Intelligence

This skill outlines how to build high-accuracy recipe extraction from photos (cookbooks, handwriting) and web URLs using the Google Gemini API with structured outputs.

---

## 1. Google Gemini API Setup — SERVER-SIDE ONLY

**Never** use `EXPO_PUBLIC_GEMINI_API_KEY` or call Gemini from the app. `EXPO_PUBLIC_` variables are bundled into the client and visible to every user.
All Gemini calls run inside **Supabase Edge Functions** (Deno), with the key stored as a Supabase secret.

```typescript
// supabase/functions/import-recipe/index.ts (Deno)
import { GoogleGenAI } from 'npm:@google/genai';

const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! });
const MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';
```

Every Edge Function must:
1. Verify the caller's Supabase session (JWT) and household membership.
2. Check the household's plan limit (`config/plans.ts` values mirrored server-side) **before** calling Gemini.
3. Call Gemini with a strict `responseSchema`.
4. Insert a row in `ai_usage` (household_id, user_id, feature, model, input_tokens, output_tokens, cost_estimate).
5. Return the draft recipe to the app for the review screen (nothing is saved until the user confirms).

The app calls functions via `supabase.functions.invoke('import-recipe', { body })` from `services/ai.ts`.

---

## 2. Structured Recipe Schema

Define a strict schema so Gemini always returns type-safe JSON matching the app's domain model:

```typescript
export interface Ingredient {
  id: string;
  item: string;              // e.g. "Krossade tomater", "Crushed tomatoes"
  quantity: number | null;   // e.g. 400; null for "salt efter smak"
  quantityMax?: number | null; // ranges: "2–3 klyftor" → 2 / 3
  unit: string | null;       // normalized code: "g", "dl", "msk", "tsk", "krm", "st", "klyfta", "cup"...
  note?: string;             // e.g. "rumstempererat", "finhackad"
  group?: string | null;     // e.g. "Sås", "Topping"
  originalText: string;      // the raw line as found in the source
  aisle: 'produce' | 'dairy' | 'meat_fish' | 'pantry' | 'spices' | 'bakery' | 'frozen' | 'other';
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number | null; // extracted timer duration
}

export interface ExtractedRecipe {
  title: string;
  description: string;
  servings: number;
  servingsEstimated: boolean;  // true if the source had no servings
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  category: 'starter' | 'main' | 'dessert' | 'snack' | 'breakfast' | 'baking' | 'drink' | 'side'; // exactly ONE
  tags: string[];              // ["Vegetarisk", "Under 30 min", "Glutenfri"] — AI-suggested, user-editable
  sourceUrl?: string;
  sourceName?: string;         // site or creator, always credited
  ingredients: Ingredient[];
  steps: RecipeStep[];
  language: 'sv' | 'en';
  estimatedFields: string[];   // which fields the AI guessed → shown with "AI-uppskattat" badge
}
```

---

## 3. Multimodal Extraction from Photo / Camera

When importing a recipe photo (e.g., from a cookbook or handwritten card):

```typescript
export async function extractRecipeFromImage(base64Image: string, mimeType: string = 'image/jpeg'): Promise<ExtractedRecipe> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            }
          },
          {
            text: `Extract this recipe into clean, structured JSON.
- Identify all ingredients with amount, unit, and item name.
- Categorize each ingredient into standard supermarket aisles: produce, dairy, meat, pantry, spices, bakery, other.
- Extract step-by-step instructions. If a step mentions a specific cooking or resting time, extract durationMinutes.
- Keep the language of the source (Swedish or English).`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      // responseSchema can be attached for strict schema validation
    }
  });

  return JSON.parse(response.text.trim()) as ExtractedRecipe;
}
```

---

## 4. URL Scraping & Web Recipe Extraction

For extracting from a webpage URL (e.g. food blog, ICA, Arla, BBC Good Food):
1. Fetch the page **server-side** (Edge Function).
2. **First** parse `application/ld+json` (`schema.org/Recipe`). If found, map it to `ExtractedRecipe` with plain code — **no AI call, does not count toward the plan limit**. (Only cheap cached lookups like aisle per item may be used.)
3. Only if schema markup is missing or incomplete: strip the HTML to text and call Gemini (counts as 1 AI import).
4. Always keep `sourceUrl` + `sourceName`. Do not copy third-party images into Storage without legal review; store the image URL reference.

---

## 5. Portion Scaling & Unit Conversion Math

### Portion Scaling
Formula:
$$\text{Scaled Amount} = \text{Original Amount} \times \left(\frac{\text{Target Servings}}{\text{Base Servings}}\right)$$

### Swedish / Metric / Imperial Conversion Rules
- **Volume to Metric**: $1\text{ msk} = 15\text{ ml} = 1.5\text{ cl}$, $1\text{ tsk} = 5\text{ ml}$, $1\text{ krm} = 1\text{ ml}$, $1\text{ dl} = 100\text{ ml}$.
- **Volume to Imperial**: $1\text{ cup} \approx 2.37\text{ dl} \approx 240\text{ ml}$, $1\text{ tbsp} \approx 15\text{ ml}$, $1\text{ tsp} \approx 5\text{ ml}$.
- **Weight**: $1\text{ oz} \approx 28.35\text{ g}$, $1\text{ lb} \approx 453.6\text{ g}$.
- When switching measurement systems, flag approximate density conversions (e.g., flour volume to weight) with "≈" as seen in the Cookaloo design specifications.
- UI has two systems: **Metriskt** (Swedish UI → dl/msk/tsk/krm/g; English UI → ml/g) and **US**. Never label anything "Imperial".
- Scaling and conversion are pure TypeScript in `lib/`, fully unit-tested — never done by the AI.
