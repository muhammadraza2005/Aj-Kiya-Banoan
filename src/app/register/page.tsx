'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [membersCount, setMembersCount] = useState(4);
  const [primaryNeed, setPrimaryNeed] = useState('both');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    // Save metadata in Supabase auth user
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          kitchen_role: role,
          eaters_count: membersCount,
          primary_need: primaryNeed
        }
      }
    });
      
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Kindly verify your email from your email.');
    }
    setLoading(false);
  };

  const adjustCount = (delta: number) => {
    setMembersCount(prev => Math.max(1, Math.min(15, prev + delta)));
  };

  return (
    <div className="bg-warm-parchment text-charcoal-ink font-sans min-h-screen antialiased selection:bg-primary-fixed selection:text-terracotta-clay flex flex-col justify-center items-center py-4 sm:py-8 px-2 sm:px-4">
      {/* Editorial Registration Canvas Container */}
      <div className="w-full max-w-5xl bg-surface-pure rounded-xl border border-border-subtle shadow-warm-hero overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Herbarium Botanical Storytelling Showcase (Col 5/12) */}
        <section className="order-2 lg:order-1 lg:col-span-5 bg-turmeric-glow/40 border-b lg:border-b-0 lg:border-r border-border-subtle p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Decorative Elements */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-saffron-amber/5 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-cardamom-emerald/5 blur-2xl pointer-events-none"></div>
          
          <div>
            {/* Brand Badge Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-lg bg-saffron-amber text-surface-pure flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined">restaurant_menu</span>
                </span>
                <div>
                  <span className="block text-lg text-primary tracking-tight font-bold font-serif">Aaj Kya Banaun?</span>
                  <span className="block font-urdu text-terracotta-clay text-xs -mt-1" dir="rtl">آج کیا بناؤں؟</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cardamom-soft text-cardamom-emerald text-[11px] font-semibold tracking-wide border border-cardamom-emerald/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cardamom-emerald"></span>
                Household Edition
              </span>
            </div>

            {/* Featured Watercolor Artwork Showcase */}
            <div className="relative group my-4">
              <div className="relative rounded-lg overflow-hidden border border-border-subtle shadow-warm-card bg-surface-pure p-1 transition-transform duration-300">
                <img alt="Botanical watercolor painting" className="w-full h-56 sm:h-64 object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe8RKOOXc6mHqBgYrUPHWFoSrJmxa1U980qKUIY_NvQc81XgDsonyGYtFugT1qDGszEbkU3D8S5-bFDTdH_elD8Am5_Ak4rVrNL9RGozRbd0CPa0FwKS_GPaTsgCiGylhopaBnqoVBoaBSlONuopZSDc78B8-koMxbL6B_FxnYVbC025p6XIKhmLKVEpfezgIhlKqWJx4zmlpiKgs1MP31K57yCjoF3x16x-JNxoG5akONYVMRybyk6w"/>
                <div className="p-2 flex items-center justify-between bg-warm-parchment/90 rounded-b-lg border-t border-border-subtle mt-1">
                  <div className="flex items-center gap-1 text-charcoal-ink">
                    <span className="material-symbols-outlined text-saffron-amber">local_florist</span>
                    <span className="text-[11px] font-semibold">Generational Flavors</span>
                  </div>
                  <span className="text-[11px] text-warm-gray italic">Heirloom Handi &amp; Spices</span>
                </div>
              </div>
            </div>

            {/* Editorial Pitch Stacks */}
            <div className="mt-8">
              <h2 className="font-serif text-xl text-primary font-bold tracking-tight">
                Start Planning Daily Meals with Love &amp; Ease
              </h2>
              <p className="text-sm text-charcoal-ink/80 mt-1 leading-relaxed">
                Transform the daily question into cherished family traditions. Thoughtful daily menus, wholesome roti portioning, and balanced dining for your whole household.
              </p>
            </div>

            {/* 3 Friendly Household Value Perks */}
            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-cardamom-soft text-cardamom-emerald flex items-center justify-center shrink-0 border border-cardamom-emerald/20">
                  <span className="material-symbols-outlined text-lg">task_alt</span>
                </div>
                <div>
                  <p className="text-sm text-charcoal-ink font-semibold">Zero daily dinner confusion</p>
                  <p className="text-xs text-warm-gray">Smart morning recommendations that eliminate stressful evening inquiries.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-turmeric-glow text-saffron-amber flex items-center justify-center shrink-0 border border-saffron-amber/20">
                  <span className="material-symbols-outlined text-lg">cookie</span>
                </div>
                <div>
                  <p className="text-sm text-charcoal-ink font-semibold">Track roti, calories &amp; nutrition balance</p>
                  <p className="text-xs text-warm-gray">Calculates macro ratios and fiber pairing badges for fresh salads and raitas.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-lg">favorite</span>
                </div>
                <div>
                  <p className="text-sm text-charcoal-ink font-semibold">Family favorites &amp; smart suggestions</p>
                  <p className="text-xs text-warm-gray">Remembers who craves daal chawal on Fridays and light sabzi during the week.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Maternal Trust Stamp */}
          <div className="pt-6 mt-6 border-t border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-1 text-cardamom-emerald text-[11px] font-semibold">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Free for family kitchens</span>
            </div>
            <span className="text-[11px] text-warm-gray">No credit card required</span>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Registration Form (Col 7/12) */}
        <section className="order-1 lg:order-2 lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-surface-pure">
          <div>
            {/* Header Stack */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border-subtle pb-4 mb-6">
              <div>
                <h1 className="font-serif text-2xl text-charcoal-ink font-bold tracking-tight">
                  Create Kitchen Account
                </h1>
                <p className="text-sm text-warm-gray mt-0.5">
                  Set up your household pantry and personalized meal cadence.
                </p>
              </div>
              <div className="text-right">
                <span className="font-urdu text-lg text-terracotta-clay font-medium" dir="rtl">نئی شروعات کریں</span>
              </div>
            </div>

            {successMsg && (
              <div className="mb-4 p-4 rounded-lg bg-cardamom-soft border border-cardamom-emerald text-cardamom-emerald">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-4 p-4 rounded-lg bg-terracotta-clay/10 border border-terracotta-clay text-terracotta-clay">
                {errorMsg}
              </div>
            )}

            {/* Registration Form */}
            {!successMsg && (
              <form className="space-y-4" onSubmit={handleRegister}>
                {/* Household Role Quick Selection */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-ink mb-1">
                    Your Name &amp; Kitchen Role
                  </label>
                  <div className="relative">
                    <input className="w-full h-12 px-4 bg-warm-parchment/60 border border-border-subtle rounded-lg text-sm text-charcoal-ink placeholder-warm-gray outline-none focus:border-terracotta-clay focus:ring-2 focus:ring-terracotta-clay/15 transition-all" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={role ? `e.g. ${role}` : "e.g. Ayesha Siddiqui or Ammi"} required type="text"/>
                    <span className="absolute right-3 top-3 text-warm-gray pointer-events-none">
                      <span className="material-symbols-outlined text-lg">person</span>
                    </span>
                  </div>
                  {/* Quick Role Badges */}
                  <div className="flex flex-wrap items-center gap-1 mt-2">
                    <span className="text-[11px] text-warm-gray mr-1">Quick choose:</span>
                    {['Ammi / Mom', 'Beti / Daughter', 'Baita / Son', 'Other'].map(r => (
                      <button key={r} type="button" onClick={() => setRole(r)} className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-all active:scale-95 ${role === r ? 'bg-terracotta-clay text-surface-pure border-terracotta-clay' : 'bg-surface-pure text-charcoal-ink border-border-subtle hover:border-terracotta-clay'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-ink mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input className="w-full h-12 px-4 bg-warm-parchment/60 border border-border-subtle rounded-lg text-sm text-charcoal-ink placeholder-warm-gray outline-none focus:border-terracotta-clay focus:ring-2 focus:ring-terracotta-clay/15 transition-all" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="kitchen@household.com" required type="email"/>
                    <span className="absolute right-3 top-3 text-warm-gray pointer-events-none">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </span>
                  </div>
                </div>

                {/* Password with Checklist */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal-ink mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input className="w-full h-12 px-4 pr-10 bg-warm-parchment/60 border border-border-subtle rounded-lg text-sm text-charcoal-ink placeholder-warm-gray outline-none focus:border-terracotta-clay focus:ring-2 focus:ring-terracotta-clay/15 transition-all" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a secure passphrase" required type={showPassword ? 'text' : 'password'}/>
                    <button className="absolute right-3 top-3 text-warm-gray hover:text-charcoal-ink transition-colors" onClick={() => setShowPassword(!showPassword)} type="button">
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {/* Password Micro Requirements Feedback */}
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px]">
                    <span className={`flex items-center gap-1 transition-colors ${password.length >= 8 ? 'text-cardamom-emerald' : 'text-warm-gray'}`}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      At least 8 characters
                    </span>
                    <span className={`flex items-center gap-1 transition-colors ${/[0-9!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-cardamom-emerald' : 'text-warm-gray'}`}>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Contains a number or symbol
                    </span>
                  </div>
                </div>

                {/* Household Dynamics Configuration (Pill Selectors) */}
                <div className="p-4 rounded-lg bg-warm-parchment border border-border-subtle">
                  <span className="block text-sm font-semibold text-charcoal-ink mb-2">
                    Household Scale &amp; Meal Habits
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Family Members Selector */}
                    <div>
                      <label className="block text-xs text-warm-gray mb-1">Eaters in House</label>
                      <div className="flex items-center justify-between bg-surface-pure border border-border-subtle rounded-lg px-2 py-1">
                        <button className="w-8 h-8 rounded flex items-center justify-center text-charcoal-ink hover:bg-turmeric-glow active:scale-95 transition-all" onClick={() => adjustCount(-1)} type="button">
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="text-[11px] font-bold text-primary">{membersCount === 1 ? '1 Family Member' : `${membersCount} Family Members`}</span>
                        <button className="w-8 h-8 rounded flex items-center justify-center text-charcoal-ink hover:bg-turmeric-glow active:scale-95 transition-all" onClick={() => adjustCount(1)} type="button">
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                    {/* Daily Prepared Meals Toggle */}
                    <div>
                      <label className="block text-xs text-warm-gray mb-1">Primary Planning Need</label>
                      <select value={primaryNeed} onChange={e => setPrimaryNeed(e.target.value)} className="w-full h-[42px] px-2 bg-surface-pure border border-border-subtle rounded-lg text-xs font-semibold text-charcoal-ink focus:outline-none focus:border-terracotta-clay">
                        <option value="both">Lunch &amp; Dinner (دوپہر اور رات)</option>
                        <option value="dinner">Dinner Focus Only (رات کا کھانا)</option>
                        <option value="all">Full Day: Nashta, Lunch &amp; Dinner</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Terms & Privacy Acknowledgement */}
                <div className="flex items-start gap-2 pt-1">
                  <input defaultChecked className="mt-1 rounded border-border-subtle text-terracotta-clay focus:ring-terracotta-clay" id="agreeTerms" required type="checkbox"/>
                  <label className="text-xs text-warm-gray select-none" htmlFor="agreeTerms">
                    I agree to the Kitchen Privacy Promise. We protect your family recipe logs and never sell personal dining insights.
                  </label>
                </div>

                {/* Primary Submission CTA Button (Saffron Amber) */}
                <button disabled={loading} className="w-full h-13 min-h-[52px] bg-saffron-amber hover:bg-terracotta-clay disabled:opacity-70 text-surface-pure text-sm font-bold rounded-lg shadow-warm-hero flex items-center justify-center gap-2 transition-all active:scale-95 mt-4" type="submit">
                  <span>{loading ? 'Creating Account...' : 'Create Household Account'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer Switching Prompt & Trust Footnote */}
          <div className="pt-4 mt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-sm text-charcoal-ink">
              Already have an account? 
              <Link className="text-terracotta-clay font-semibold hover:underline decoration-terracotta-clay/40 transition-colors ml-1 inline-flex items-center gap-1" href="/login">
                <span>Log In</span>
                <span className="material-symbols-outlined text-sm">login</span>
              </Link>
            </p>
            <div className="flex items-center gap-1 text-warm-gray text-[11px] font-semibold">
              <span className="material-symbols-outlined text-cardamom-emerald text-base">shield</span>
              <span>Family Kitchen Encryption</span>
            </div>
          </div>
        </section>
      </div>

      {/* Soft Editorial Footnote */}
      <div className="mt-4 text-center">
        <p className="text-[11px] text-warm-gray">
          &apos;Aaj Kya Banaun?&apos; Culinary Companion • Handcrafted with care for South Asian kitchens
        </p>
      </div>
    </div>
  );
}
