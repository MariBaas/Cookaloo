---
name: cookaloo-design-system
description: Design tokens, typography guidelines, and UI component specifications for Cookaloo based on the 'Linne' (Linen) and Herb Garden aesthetic.
---

# Cookaloo Design System: "Linne" & Herb Garden

This skill specifies the visual language, color tokens, typography scales, and UI interaction models for the Cookaloo mobile and web application.

---

## 1. Color Palette & Tokens

### Light Theme ("Linne" / Warm Linen)
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--bg` | `#F6F1E9` | Main page canvas / warm natural background |
| `--surface` | `#FFFDF9` | Card surfaces, recipe cards, modals |
| `--surface2` | `#EFE7DC` | Secondary controls, search inputs, icon containers |
| `--line` | `#E6DCCF` | Subtle borders, dividers |
| `--line2` | `#DCCFBF` | Input borders, prominent dividers |
| `--ink` | `#2A211B` | Primary text, titles, dark contrast pills |
| `--muted` | `#6E6259` | Secondary text, timestamps, labels |
| `--acc` | `#B4472A` | Primary accent (warm terracotta) |
| `--accInk` | `#FFFFFF` | Text on terracotta buttons |
| `--accSoft` | `#F4E1D7` | Tinted icon containers, active badge backgrounds |
| `--accText` | `#8A3218` | Accent text, links |
| `--herb` | `#2F6A43` | Fresh herb green (tags, "Provat" / tried badges) |
| `--herbSoft` | `#E1EDE3` | Subtle green tint badge background |
| `--herbText` | `#24573A` | Green text |
| `--warnSoft` | `#FBEFD9` | Warning / timer active badge |
| `--warnText` | `#7A4E0C` | Warning text |
| `--shadow` | `0 1px 2px rgba(42,33,27,.05), 0 6px 20px rgba(42,33,27,.06)` | Elevation shadow |

### Dark Theme
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--bg` | `#1A1613` | Deep warm charcoal canvas |
| `--surface` | `#25201C` | Elevated cards |
| `--surface2` | `#302924` | Secondary button backgrounds |
| `--line` | `#3A322B` | Borders and dividers |
| `--ink` | `#F3EBE1` | Warm white primary text |
| `--muted` | `#B5A899` | Muted subtitle text |
| `--acc` | `#E07A55` | Vibrant terracotta for dark contrast |
| `--accInk` | `#1A1613` | Text on accent |
| `--herb` | `#86C79A` | Minty herb green for dark contrast |

---

## 2. Typography Hierarchy

1. **Brand Logo**:
   - `Bricolage Grotesque`, Extra Bold (800), letter-spacing: `-0.045em`.
   - Distinctive dual "oo" circle glyphs with terracotta accent.
2. **Headings & Recipe Titles**:
   - `Newsreader`, Serif, Medium (500) or Regular (400), optical size `6..72`.
   - Evokes classic Scandinavian editorial cookbooks and magazines.
3. **Interface & Body Text**:
   - `Figtree`, Sans-serif, 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold).
   - High legibility at small sizes for ingredient lists and measurements.

---

## 3. Key Component Specs

### 1. Recipe Card
- **Radius**: `22px` rounded corners.
- **Image**: `16:10` aspect ratio with fallback monogram monogram circle (`Newsreader` italic) when no photo is uploaded.
- **Badge**: "Provat" pill overlay (`#2F6A43` on `#FFFDF9` with checkmark icon).
- **Meta row**: Category dot separator, cooking time icon with duration, star rating with average and last cooked date.

### 2. Floating Action Button (FAB) / Central Import Action
- **Position**: Center item in bottom navigation.
- **Size**: `52px` diameter circular terracotta pill (`#B4472A`), elevated `6px` above the tab line with shadow `0 6px 16px rgba(180,71,42,.35)`.
- **Icon**: Plus icon (`#FFFFFF`).

### 3. Smart Grocery List (Inköpslista)
- Grouped by supermarket section: *Grönsaker & Frukt*, *Mejeri*, *Kött & Fisk*, *Skafferi*, *Kryddor*, *Bröd & Bageri*, *Fryst*, *Övrigt*.
- Export button: **Kopiera till OurGroceries** (one item per line, e.g. "3 dl grädde").
- Strike-through animation on check; haptic pulse (`expo-haptics`) on native only, no-op on web.
- Strikethrough items move to collapsed "Avbockade" (Checked) section.

### 4. Interactive Cooking Mode (Matlagningsläge) — V2, NOT in MVP
- Large step text with high contrast for reading from kitchen counter distance.
- Integrated interactive timers with quick countdown ("Sjud i 12 min" -> one tap to start timer).
- Keep-awake active during cooking session.

### 5. Plan limit & Premium states
- Limit card uses `--warnSoft` / `--warnText` (as in the prototype), text driven by `config/plans.ts` (free: 10 AI imports/month) — never hardcode the number.
- Add a clear secondary action "Läs om Premium" / "About Premium" that opens a sheet listing what Premium unlocks. No payment flow in MVP.

### 6. Unit toggle
- Segmented control with two options: **Metriskt | US** (EN: Metric | US). See `app-i18n-localization` for which units each shows.
