# Backend & Recommendation Engine Specification — Aaj Kya Banaun? (آج کیا بناؤں؟)

> **Purpose:** This document specifies the deterministic recommendation scoring engine, pairing logic, nutritional calculations, and API contracts for the backend.

---

## 1. Core Architecture Principles

1. **Deterministic Rule Engine (No Black-Box ML / Hallucinations):**
   - The engine scores every available dish in the database based on a transparent mathematical formula.
   - 100% explainable: Every score directly outputs human-readable reasons (e.g. *"Favorite"*, *"Not cooked in 7 days"*, *"Restores weekly iron"*).
2. **Real-Time Dynamic Recalculation:**
   - Whenever Mom logs a meal, skips a dish, or toggles a mood filter (e.g., `Gosht`, `Sabzi`, `Jaldi`), the backend filters and re-ranks the candidates instantly.
3. **Accompaniment & Nutrition Math:**
   - Dish calories and macros are dynamically combined with the selected accompaniment (e.g. +180 kcal for 2 Rotis) and side pairings.

---

## 2. The Recommendation Scoring Formula

For each candidate dish $D$, the total recommendation score is calculated as:

$$\text{Total Score}(D) = S_{\text{preference}} + S_{\text{recency}} + S_{\text{variety}} + S_{\text{nutrient\_gap}} + S_{\text{mood}} - P_{\text{repetition}} - P_{\text{dislike}} - P_{\text{skip\_today}}$$

### Detailed Scoring Breakdown:

| Factor | Weight / Range | Description & Rules |
| :--- | :--- | :--- |
| **$S_{\text{preference}}$ (Base Preference)** | `+0` to `+20` | Star rating (1 to 5 stars) from user preferences ($rating \times 4$). |
| **$S_{\text{favorite}}$ (Favorite Bonus)** | `+15` | If marked as a household favorite (❤️). |
| **$S_{\text{recency}}$ (Days Since Last Eaten)** | `+0` to `+25` | - **Not eaten in $\ge 7$ days:** `+25`<br>- **Not eaten in 4–6 days:** `+15`<br>- **Not eaten in 2–3 days:** `+5`<br>- **Eaten yesterday:** `0` (and triggers penalty below). |
| **$P_{\text{repetition}}$ (Recency Penalty)** | `-35` to `-15` | - **Eaten yesterday:** `-35` (moves to *"Aaj Rehnay Dein"* tier).<br>- **Eaten 2 days ago:** `-15`. |
| **$S_{\text{variety}}$ (Category Diversity)** | `+0` to `+15` | If the candidate dish belongs to a food category (e.g. Daal or Sabzi) that hasn't appeared in the last 3 days, award `+15`. If the same category (e.g. Chicken) was eaten 2 days in a row, award `-15`. |
| **$S_{\text{nutrient\_gap}}$ (Nutrient Balancing)** | `+0` to `+20` | - **Iron Gap:** If the last 5 days lacked iron-rich foods, boost iron sources (Mutton Kaleji, Palak, Lentils) by `+20`.<br>- **Protein Balance:** If recent meals were heavy carbs (Rice/Aloo), boost high-protein meat/eggs by `+15`.<br>- **Fiber Opportunity:** If recent meals lacked fiber, boost Daal/Sabzi by `+10`. |
| **$S_{\text{mood}}$ (Quick Filter Match)** | `Filter / +10` | If Mom taps a mood filter chip (e.g. `Gosht`, `Sabzi`, `Jaldi <30m`), candidates matching the filter receive priority. |
| **$P_{\text{dislike}}$ (Dislike Demotion)** | `-50` | If marked as disliked (👎), strongly demote to the bottom. |
| **$P_{\text{skip\_today}}$ (Temporary Dismissal)** | `-1000` | If Mom taps *"Aaj Nahi"* today, exclude completely from today's pool. |

---

## 3. "Why Today?" (Reason Generation Engine)

The engine returns an array of human-readable tags and bilingual strings for the top dishes:

```typescript
export interface RecommendationReason {
  type: 'favorite' | 'recency' | 'nutrient' | 'variety' | 'quick';
  badgeEn: string;
  badgeUrdu: string;
  explanationEn: string;
  explanationUrdu: string;
}
```

### Example Engine Output:
```json
{
  "foodId": "food-chicken-pulao",
  "name": "Chicken Pulao",
  "urduName": "چکن پلاؤ",
  "score": 88,
  "tier": "BEST_CHOICE",
  "reasons": [
    {
      "type": "recency",
      "badgeEn": "Not in 6 Days",
      "badgeUrdu": "6 دن بعد",
      "explanationEn": "You haven't cooked rice dishes in 5 days.",
      "explanationUrdu": "آپ نے 5 دن سے چاول نہیں بنائے"
    },
    {
      "type": "favorite",
      "badgeEn": "Son's Favorite",
      "badgeUrdu": "پسندیدہ کھانا",
      "explanationEn": "Ranked 5 stars by Muhammad.",
      "explanationUrdu": "گھر میں سب کا پسندیدہ"
    }
  ]
}
```

---

## 4. Smart Meal Pairing & Roti Calculation Logic

When a dish is selected, the backend calculates the complete meal matrix:

### 1. Accompaniment Calculation
- **If dish category is Curry / Salan / Daal / Meat:**
  - Accompaniment options: `Roti (Phulka)`, `Naan`, `Sada Chawal (White Rice)`, `Baghair Roti (None)`.
  - Default unit: `1 Whole Wheat Roti` = `+90 kcal, 3g protein, 18g carbs, 0.5g fat, 2.5g fiber`.
  - Formula: $\text{Meal Macros} = \text{Dish Macros} + (\text{Roti Count} \times \text{Roti Macros})$.

### 2. Mealtime Side Pairing Engine
- Automatically pairs complementary fresh sides based on dish properties:
  - **Oily / Rich curries (Karahi, Biryani, Nihari):** Suggests `Fresh Green Salad 🥗` (high fiber, digestion enzymes) + `Zeera/Pudina Raita 🥒` (probiotics, cooling).
  - **Dry Sabzi / Fried items:** Suggests `Cucumber Salad` or `Kachumar`.

### 3. "Later Today" Evening / Night Pairing Engine
- If the main meal was high in carbs or low in specific micronutrients:
  - Suggests `5-7 Almonds (Badam) 🥜` (adds 50 kcal, healthy monounsaturated fats, 40mg magnesium, vitamin E).
  - Or `Seasonal Fruit (Apple / Pomegranate) 🍎` (antioxidants, Vitamin C).

---

## 5. API Contracts & Server Actions (Next.js / TypeScript)

### A. `getDailyRecommendations(userId: string, filter?: string, mealTime?: 'lunch' | 'dinner')`
- **Input:** User/Household ID, optional mood filter (`all`, `meat`, `daal`, `sabzi`, `rice`, `quick`), meal time.
- **Output:**
  ```typescript
  interface DailyRecommendationResponse {
    topPick: ScoredDish;              // Tier 1 (Hero Card)
    alternatives: ScoredDish[];       // Tier 2 (Also Consider - 2 dishes)
    skipToday: ScoredDish[];          // Tier 3 (Omitted with reason - 1-2 dishes)
    generatedAt: string;
  }
  ```

### B. `logMealHistory(payload: LogMealPayload)`
- **Input:**
  ```typescript
  interface LogMealPayload {
    userId: string;
    foodId: string;
    mealDate: string;                 // YYYY-MM-DD
    mealTime: 'lunch' | 'dinner';
    accompanimentType?: 'roti' | 'rice' | 'none';
    accompanimentQuantity: number;    // e.g. 2
    pairingsSelected: string[];       // ['pairing-salad', 'pairing-badam']
    totalCalories: number;
    notes?: string;
  }
  ```
- **Output:** `{ success: boolean; logId: string; updatedWeeklyBalance: WeeklyBalanceSummary }`.

### C. `dismissDishToday(userId: string, foodId: string)`
- **Input:** Dish ID.
- **Action:** Temporarily flags dish as skipped for the current calendar date without affecting permanent ratings.

### D. `updateFoodPreference(userId: string, foodId: string, rating: 1 | 2 | 3 | 4 | 5, isFavorite: boolean)`
- **Input:** Dish ID, preference level, favorite boolean.
- **Action:** Updates `user_preferences` table in Supabase.
