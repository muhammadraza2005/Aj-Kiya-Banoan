# Frontend Design & UI Specification — Aaj Kya Banaun? (آج کیا بناؤں؟)

> **Purpose:** This document is the master frontend design and specification blueprint. It defines all screens, component hierarchies, interaction states, visual design tokens, and bilingual content. Use this specification directly with **Google Stitch** to generate the design UI and components.

---

## 1. Product Vision & Design Philosophy

- **The Core User:** Primarily Mom (using a smartphone in the kitchen), along with family members / son who are picky eaters.
- **Tone & Mood:** Warm, homely, respectful, appetizing, modern Desi heritage. Feels like a caring culinary companion, not a cold medical or SaaS dashboard.
- **Form Factor:** **Mobile-First (390px – 430px portrait viewport)**. Smoothly responsive up to desktop screens with a centered mobile shell container.
- **Language & Accessibility:** Bilingual English + Urdu. Food titles prominently feature Urdu in brackets (e.g. `Chicken Pulao (چکن پلاؤ)`). High contrast, large touch targets (minimum 48px height), zero kitchen friction.

---

## 2. Design System & Style Tokens (For Google Stitch)

### Color Palette
- **Primary / Saffron Amber:** `#E65100` (Deep Amber / Zafraan) — Warm, energetic primary CTA buttons and highlights.
- **Primary Light / Turmeric Glow:** `#FFF8E1` — Soft card backgrounds, tag highlights.
- **Secondary / Cardamom Emerald:** `#1B5E20` (Subtle herb green) — Freshness, healthy pairing badges, balance indicators.
- **Accent / Terracotta Clay:** `#BF360C` — Accent borders, favorite hearts, warm tags.
- **Neutral Dark / Charcoal:** `#1F2937` — Primary headings, readable text with high contrast.
- **Neutral Muted / Warm Gray:** `#6B7280` — Subtitles, nutrient labels, inactive icons.
- **Background / Soft Warm Parchment:** `#FAFAF8` — Eye-friendly warm background (avoids sterile blue-white).
- **Surface / Card Background:** `#FFFFFF` with soft warm shadows (`box-shadow: 0 4px 20px -2px rgba(180, 83, 9, 0.08)`).

### Typography
- **Headings & English Body:** `Outfit`, `Plus Jakarta Sans`, or `Inter` (geometric, clean, friendly).
- **Urdu Script:** `Noto Nastaliq Urdu` or `Noto Sans Arabic` (legible, elegant, native feel).
- **Hierarchy:**
  - Screen Titles: 24px - 28px, Bold / Semi-bold.
  - Dish English Name: 18px - 20px, Semi-bold.
  - Dish Urdu Name: 16px - 18px, Regular/Medium (Urdu script).
  - Micro-copy & Tags: 12px - 14px, Medium.

### Iconography & Micro-interactions
- Soft rounded icons (`Lucide Icons` or similar SVG).
- Food emojis integrated gracefully (`🍲`, `🍚`, `🍗`, `🥗`, `🥜`, `🎲`).
- Smooth card flip/fade on recommendations.
- Interactive stepper for the Roti counter (`-`, count, `+`).

---

## 3. Global Navigation Architecture

A sleek, sticky **Bottom Navigation Bar** on mobile viewports:
1. 🏠 **Aaj Kya Banaun** (Home / Hero Recommendation Deck)
2. 📅 **Tareekh** (7-Day History & Balance)
3. ❤️ **Pasand** (Favorites & Dislikes Catalog)
4. ⚙️ **Settings** (Family profile, portion sizes, simple persistent access)

---

## 4. Detailed Screen Specifications

### Screen 1: Home — "Aaj Kya Banaun?" (Recommendation Deck)

#### A. Header Section
- **Greeting Banner:**
  - Title: *"Assalam-o-Alaikum, Ammi ❤️"* (or customizable profile name).
  - Subtitle: *"Aaj kya bananay ka irada hai?"* (What are we planning to cook today?).
  - Date & Day: e.g. *"Monday, 22 Sep"*.
- **Meal Time Toggle:**
  - Segmented pill toggle: `[ ☀️ Dupahar / Lunch ]` | `[ 🌙 Raat / Dinner ]` (active by default depending on time of day).

#### B. Quick Mood Filter Chips (Horizontal Scrollable)
- Single-tap filters to narrow down today's pool without tedious checklists:
  - `✨ Sab (All)` [Active by default]
  - `🍗 Gosht / Meat`
  - `🥣 Daal`
  - `🥬 Sabzi / Veg`
  - `🍚 Chawal / Rice`
  - `⚡ Jaldi (<30 min)`

#### C. Hero Recommendation Card (⭐ Tier 1: "Aaj Ka Best Mashwara")
- Large, hero-styled card with prominent food photography:
  - **Image:** Full-bleed rounded food photo (4:3 aspect ratio) with high visual appeal.
  - **Title:** `Chicken Pulao (چکن پلاؤ)`
  - **Badges:**
    - `⭐ Top Recommendation` (Gold tag)
    - `❤️ Son's Favorite` (Soft red tag)
    - `🕒 6 Din Baad` (Recency indicator)
  - **"Why Today?" (Mashwara Kyun?):**
    - A gentle, warm callout card:
      - *"Aap ne 5 din se chawal nahi banaye."* (Haven't cooked rice in 5 days).
      - *"Provides good protein & energy for dinner."*
  - **Nutrition Quick Glance:**
    - `~620 kcal` • `32g Protein` • `72g Carbs`
  - **Action Buttons:**
    - **Primary Button (Full Width):** `🍳 Yeh Banao (Cook This)` -> Opens the *Meal Pairing & Accompaniment Sheet*.
    - **Secondary Button:** `🚫 Aaj Nahi (Not Today)` -> Dismisses this option for today and reveals the next best suggestion.

#### D. "Surprise Me" Floating / Quick Action
- **Button:** `🎲 Aaj Kuch Acha Suggest Karein (Surprise Me!)`
- Tapping triggers a playful 1-second shuffle animation and presents a top-ranked dish immediately.

#### E. Tier 2: "Yeh Bhi Acha Hai" (Also Consider)
- Section Header: `💡 Dusray Achay Options (Alternatives)`
- 2 compact horizontal cards showing diverse alternatives (e.g., one Daal, one Karahi):
  - Thumbnail + Dish title (English + Urdu) + Brief reason (e.g. `Mutton Karahi — High Iron & Protein`).
  - Quick tap to inspect or select.

#### F. Tier 3: "Aaj Rehnay Dein" (Skip Today — Collapsible)
- Accordion header: `⏸️ Aaj Inko Rehnay Dein (1-2 dishes)`
- Respectfully shows why certain dishes aren't recommended today:
  - e.g., `Aloo Anda` — *"Kal hi khaya tha, variety ke liye aaj kuch naya try karein."* (Had it yesterday; try something fresh for variety).

---

### Screen 2: Meal Pairing & Roti Accompaniment Sheet (Bottom Sheet Modal)

*Triggered when Mom taps "Yeh Banao (Cook This)" on any dish card.*

#### A. Selected Dish Summary
- Thumbnail, `Chicken Pulao (چکن پلاؤ)`, base calorie & macro estimate.

#### B. Desi Accompaniment Section (The Roti / Rice Stepper)
- If the dish is a Curry/Salan (e.g., Aloo Anda, Mutton Karahi, Chana Dal):
  - Label: **"Saath me kya khayein gay?"** (What will you eat it with?)
  - Accompaniment Selector: `[ Roti / Phulka 🫓 ]` | `[ Sada Chawal 🍚 ]` | `[ Baghair Roti ]`
  - Stepper: `[ - ]  2 Roti  [ + ]` (dynamically updates: `+180 kcal, 36g carbs`).

#### C. "Saath Me Kya Shamil Karein?" (Mealtime Pairings)
- Quick toggle chips with estimated nutrient benefits:
  - `🥗 Fresh Salad (Kheera & Tamatar) (+25 kcal • Fiber)`
  - `🥒 Zeera Raita (+45 kcal • Calcium)`
  - `🍋 Mint & Coriander Chutney (+15 kcal)`

#### D. "Raat Ko / Baad Me" (Evening & Night Snack Pairing)
- Culturally authentic Desi recommendations to compensate for daily gaps:
  - `🥜 5-6 Badam (Almonds) raat ko (+50 kcal • Healthy Fats & Magnesium)`
  - `🍎 Ek Seb (Apple) shaam ko (+60 kcal • Vitamins)`
  - `🥛 Garam Doodh (Warm Milk)`

#### E. Final Confirmation CTA
- Total estimated meal stats banner: `Total: ~780 kcal • 38g Protein`.
- Large button: `✅ Khana Final Karein (Log to Today's History)`.

---

### Screen 3: History & Weekly Variety (📅 Tareekh)

#### A. Weekly Calendar Strip (Monday – Sunday)
- 7 circular date badges showing active status, highlighting today.
- Visual dot badges indicating if meal was logged.

#### B. Daily Meal Cards (Chronological Feed)
- **Today (Monday):**
  - Main: `Chicken Pulao (چکن پلاؤ) 🍛`
  - Sides: `Fresh Salad 🥗` + `5 Badam 🥜 (Raat ko)`
  - Accompaniments: `1 Plate`
- **Yesterday (Sunday):**
  - Main: `Aloo Anda (آلو انڈہ) 🍳`
  - Accompaniments: `2 Roti 🫓`
  - Sides: `Cucumber Raita 🥒`

#### C. Weekly Variety & Nutrient Balance Card
- A gentle, non-judgmental graphic card:
  - **Category Diversity:** `Gosht / Meat: 3x` • `Daal: 2x` • `Sabzi: 2x` • `Chawal: 1x`.
  - **Nutrient Opportunity Tip:**
    - *"Is haftay iron-rich foods kam rahay hain. Kal Mutton Kaleji ya Palak plan karnay ka mashwara hai!"* (Iron intake was lower this week. Consider Mutton Kaleji or Palak soon!).

---

### Screen 4: Favorites & Preferences Catalog (❤️ Pasand)

#### A. Search & Category Filters
- Search input: *"Search any dish (e.g. Biryani, Daal, Bhindi)..."*
- Category tabs: `All`, `Rice`, `Karahi & Meat`, `Daal`, `Sabzi`, `Snacks & Sides`.

#### B. Food Card Grid
- Clean, compact card layout:
  - Food Photo
  - English & Urdu Name
  - Macro tags: `High Protein`, `Fiber Rich`
  - **Preference Toggle Actions:**
    - ❤️ **Favorite:** Stars the dish (+15 bonus in scoring).
    - 👍 **Like:** Friendly vote (+5 bonus).
    - 👎 **Dislike:** Demotes dish heavily (-30 penalty).
    - 🚫 **Temporary Disable:** "Aaj ghar me nahi ban sakta" (Hides for 24h).

---

## 5. Google Stitch Direct Prompt (Copy-Paste Ready)

```text
Design a warm, modern, mobile-first web app UI for "Aaj Kya Banaun?" (آج کیا بناؤں؟), a personalized Pakistani household meal recommendation and nutrition planner built for a Desi mother and her family.

App Atmosphere & Tone:
- Clean, warm, appetizing, and friendly (NOT a clinical medical SaaS).
- Color Palette: Rich Saffron Amber (#E65100), Cardamom Green (#1B5E20), Terracotta (#BF360C), Soft Warm White (#FAFAF8), Dark Charcoal Text (#1F2937).
- Typography: Modern clean sans-serif (Inter/Outfit) paired with beautiful Urdu Nastaliq script for dish titles.
- Viewport: Mobile screen (390px x 844px) with rounded modern container.

Key Screens to Render:
1. Home Screen ("Aaj Kya Banaun?"):
   - Top Header: Warm greeting ("Assalam-o-Alaikum, Ammi ❤️"), Date, and a Lunch/Dinner toggle.
   - Mood Filter Chips: "Sab", "Gosht 🍗", "Daal 🥣", "Sabzi 🥬", "Chawal 🍚", "Jaldi (<30m)".
   - Hero Recommendation Card (⭐ "Aaj Ka Best Mashwara"):
     - High-quality photo of Chicken Pulao.
     - Bilingual title: "Chicken Pulao (چکن پلاؤ)".
     - Tags: "❤️ Favorite", "🕒 6 Din Baad", "💪 High Protein".
     - "Why Today?" callout box explaining why it was chosen.
     - Primary button: "🍳 Yeh Banao (Cook This)" + Secondary "🚫 Aaj Nahi".
   - "Surprise Me" Floating dice button: "🎲 Aaj Kuch Acha Suggest Karein".
   - Section below: "💡 Dusray Achay Options" with 2 horizontal mini cards (Mutton Karahi, Moong Dal).
   - Bottom Sticky Navigation: 🏠 Aaj Kya Banaun, 📅 Tareekh (History), ❤️ Pasand (Favorites), ⚙️ Settings.

2. Meal Pairing & Roti Stepper Bottom Sheet Modal:
   - Preview of selected dish with calories.
   - Accompaniment Stepper: "Saath me kya khayein gay?" with Roti counter: [-] 2 Roti [+] (+180 kcal).
   - Mealtime Pairing Chips: "Fresh Salad 🥗", "Zeera Raita 🥒".
   - Evening / Night Pairing Chips: "5 Badam (Almonds) raat ko 🥜", "Seb 🍎".
   - Large CTA: "✅ Khana Final Karein".

3. 7-Day History & Variety Screen:
   - 7-day calendar bar showing Monday-Sunday with completion rings.
   - Chronological meal log cards showing previous days' meals + rotis.
   - Variety summary badge showing balance between Meat, Veg, Daal, and Rice.
```

---

## 6. Frontend Component Architecture (Next.js / React)

```
components/
├── layout/
│   ├── MobileContainer.tsx      # Centers app on desktop, native feel on mobile
│   ├── BottomNav.tsx            # Sticky 4-tab mobile navigation
│   └── HeaderGreeting.tsx       # "Assalam-o-Alaikum, Ammi" + Time of Day toggle
├── recommendations/
│   ├── HeroFoodCard.tsx         # Top Pick with photo, Urdu name, badges, CTA
│   ├── MoodFilterBar.tsx        # Horizontal scrolling chips (Gosht, Daal, Sabzi...)
│   ├── AlternativeCards.tsx     # Tier 2 suggestions carousel/grid
│   ├── SkipTodayAccordion.tsx   # Tier 3 respectfully omitted dishes
│   └── SurpriseMeButton.tsx     # Animated dice roll randomizer
├── meal-logging/
│   ├── PairingModal.tsx         # Bottom sheet drawer for final meal setup
│   ├── RotiStepper.tsx          # 1-tap Roti / Rice accompaniment counter
│   ├── SidePairingChips.tsx     # Salad, Raita, Mint Chutney selection
│   └── EveningSnackPicker.tsx   # Almonds / Fruits / Milk selection
├── history/
│   ├── WeeklyTimeline.tsx       # 7-day pill timeline
│   ├── HistoryCard.tsx          # Card displaying logged dish, rotis, & sides
│   └── VarietyBar.tsx           # Visual balance across food categories
└── favorites/
    ├── FoodSearchInput.tsx      # Fast search bar with category pills
    └── FoodPreferenceCard.tsx   # Dish card with Heart/Like/Dislike toggles
```
