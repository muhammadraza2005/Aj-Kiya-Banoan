# 🚀 Aaj Kya Banaun - Project Status & Remaining Tasks

We've made massive progress! We have successfully built the core MVP (Minimum Viable Product). The recommendation engine works, the frontend is beautiful, and the app is successfully reading and writing live data to Supabase.

Here is a comprehensive breakdown of what is left to take the app from a working prototype to a production-ready application.

---

## 1. 🔐 Authentication & Real Users
Currently, the app relies on "mock" family members (Ammi, Abu, etc.) with hardcoded UUIDs.
- **Implement Supabase Auth:** Add a simple login screen. For a kitchen app, a passwordless OTP (Email/WhatsApp) or Google Sign-In is highly recommended.
- **Dynamic Profile Creation:** Allow users to create their own household and family member profiles instead of using the mock ones.

## 2. 🛡️ Security (Re-enabling RLS)
Once authentication is in place, we need to secure the database.
- **Enable Row Level Security (RLS):** Turn RLS back on for all tables.
- **Write Policies:** Create policies so that User A can only see and modify User A's meal history and favorite dishes, while keeping the main `foods` catalog publicly readable.

## 3. 🎯 Mood & Filters (UI Implementation)
The backend scoring engine (`src/domain/scoring.ts`) already supports filtering by mood (e.g., `quick` for <30 mins, `meat` for Gosht). 
- **Add Filter UI:** We need to add filter chips on the Home Screen (e.g., "In a hurry?", "Craving Meat?", "Healthy") and pass that selected state into the `generateDailyRecommendations` function to dynamically re-rank the deck.

## 4. 🚫 "Aaj Nahi" (Skip For Today) Feature
The scoring engine heavily penalizes dishes that are marked as "Skipped Today", but we haven't wired this up to the database yet.
- **Implement DB Logic:** Write the `dismissDishInDB` function to save skipped dishes to the `daily_dismissals` table.
- **Wire up the Button:** When the user clicks "Dusra Dikhao 🎲", we should optionally mark the skipped dish in the state/database so it doesn't show up again until tomorrow.

## 5. 🫓 Smart Pairings (Accompaniments)
Currently, the portion modal lets you select Rotis and sides, but it isn't saving the specific sides to the database perfectly.
- **Save Pairings:** When a meal is logged, insert the selected side items (like Raita, Salad) into the `meal_history_pairings` table.
- **Fetch Pairings:** Display exactly what sides were eaten in the Tareekh (History) tab.

## 6. 📱 PWA & Offline Support
We added the `manifest.json` so the app is recognized, but a true kitchen app should work even if the Wi-Fi drops.
- **Service Worker:** Implement a library like `next-pwa` to cache the dishes and images. This will allow the app to load instantly and function offline, syncing logs when the internet returns.

## 7. 🚀 Production Deployment
- **Deploy to Vercel:** Push the code to GitHub and connect it to Vercel for free hosting.
- **Environment Variables:** Set up production Supabase URLs and Keys in Vercel.

---

### Suggested Next Step:
If you want to keep building right now, the easiest and most impactful next feature to tackle is **#4 ("Aaj Nahi" / Skip for today)** or **#3 (Mood Filters)**! Which one would you like to focus on?
