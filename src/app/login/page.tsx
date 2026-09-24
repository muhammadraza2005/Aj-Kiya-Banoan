'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
      
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Please verify your email from your email.');
      } else {
        setErrorMsg(error.message);
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="bg-warm-parchment text-charcoal-ink font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-terracotta-clay">
      <main className="w-full flex-grow flex items-center justify-center p-2 sm:p-4 lg:p-8">
        <div className="w-full max-w-5xl bg-surface-pure rounded-xl border border-border-subtle shadow-warm-hero overflow-hidden flex flex-col-reverse lg:flex-row">
          {/* Artistic Showcase / Illustration Panel (Desktop Left, Tablet/Mobile Bottom) */}
          <div className="lg:w-1/2 relative bg-turmeric-glow/40 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border-subtle">
            {/* Top Visual Header / Badge inside visual panel */}
            <div className="p-4 sm:p-6 relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1 bg-surface-pure/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border-subtle shadow-sm">
                <span className="w-2 h-2 rounded-full bg-saffron-amber animate-pulse"></span>
                <span className="text-[11px] font-semibold text-terracotta-clay">Ghar Ka Zaika • Daily Kitchen</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-cardamom-emerald bg-cardamom-soft px-2 py-1 rounded-full border border-cardamom-emerald/20">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                <span className="text-[11px] font-semibold">100% Desi Heritage</span>
              </div>
            </div>
            {/* Watercolor Artwork Hero */}
            <div className="relative px-4 sm:px-6 py-2 flex flex-col items-center">
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none rounded-xl overflow-hidden shadow-inner border border-border-subtle/80 bg-warm-parchment group">
                <img alt="Watercolor South Asian kitchen illustration" className="w-full h-56 sm:h-72 lg:h-[380px] object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi7vd_lzMYgggnkvjB_ZL6E3-BuEgbXaPfOsIse6EfDP9WBOhol4Fn-K-jvFx01jIrE5Oh5behNYEPmvOccv2VL4m_kGwpntPk4uUfYU7yZKwnjQoFeJ7_h3p1qVN5wvyucYfhu_nGG6WWX29XchWAlsJNpSYxJgT8e1TGxiW2KET6WbH5fbhmqzpQHL2l-L2v-kumGNHg1_53gv1CjjQTTjNkPRjskU6Z-0jFom3eoZOF0a6Z0vJWfw"/>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/60 via-transparent to-transparent opacity-60"></div>
                {/* Floating Quote in Artwork */}
                <div className="absolute bottom-3 left-3 right-3 text-surface-pure p-2 rounded-lg backdrop-blur-md bg-charcoal-ink/40 border border-surface-pure/20">
                  <p className="font-urdu text-lg text-right text-turmeric-glow leading-tight" dir="rtl">
                    &quot;روز کا وہی سوال، آج کیا پکائیں؟&quot;
                  </p>
                  <p className="text-sm text-surface-pure/90 mt-0.5 italic">
                    From clay handi aroma to tonight&apos;s dinner table, planned effortlessly.
                  </p>
                </div>
              </div>
            </div>
            {/* Bottom Testimonial / Social Proof */}
            <div className="p-4 sm:p-6 relative z-10 bg-gradient-to-t from-warm-parchment/90 to-transparent">
              <div className="flex items-center gap-4 bg-surface-pure/95 p-4 rounded-lg border border-border-subtle">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-pure bg-primary-fixed flex items-center justify-center font-bold text-terracotta-clay text-xs">
                    AK
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-pure bg-turmeric-glow flex items-center justify-center font-bold text-saffron-amber text-xs">
                    SN
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-pure bg-cardamom-soft flex items-center justify-center font-bold text-cardamom-emerald text-xs">
                    FB
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-saffron-amber">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-xs text-charcoal-ink font-semibold mt-1">
                    Loved by 45,000+ Desi households &amp; busy mothers
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Right Form Column */}
          <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center bg-surface-pure">
            {/* Brand & Bilingual Header */}
            <div className="mb-6 text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-terracotta-clay shadow-sm">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>dinner_dining</span>
                  </div>
                  <div>
                    <span className="font-serif text-lg font-bold text-primary tracking-tight block">Aaj Kya Banaun?</span>
                  </div>
                </div>
                <span className="font-urdu text-lg text-terracotta-clay font-bold" dir="rtl">
                  آج کیا بناؤں؟
                </span>
              </div>
              <h1 className="font-serif text-2xl text-charcoal-ink font-bold mt-2">
                Welcome back to your kitchen
              </h1>
              <p className="text-sm text-warm-gray mt-1">
                Sign in to check today&apos;s curated recommendations, pantry rotation, and family favorites.
              </p>
            </div>
            
            {errorMsg && <p className="text-sm text-terracotta-clay bg-terracotta-clay/10 p-3 rounded-lg mb-4">{errorMsg}</p>}
            
            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-sm text-charcoal-ink font-semibold" htmlFor="email">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-lg border border-border-subtle bg-warm-parchment/50 focus-within:border-terracotta-clay focus-within:ring-2 focus-within:ring-terracotta-clay/15 transition-all duration-200">
                  <div className="pl-4 pr-1 text-warm-gray flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <input className="w-full h-12 bg-transparent border-0 text-charcoal-ink text-sm placeholder:text-warm-gray/60 focus:ring-0 px-2 pr-4 outline-none" id="email" name="email" placeholder="ammi@ghar.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-charcoal-ink font-semibold" htmlFor="password">
                    Password
                  </label>
                  <a className="text-xs text-terracotta-clay hover:text-primary underline-offset-2 hover:underline transition-colors" href="#">
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center rounded-lg border border-border-subtle bg-warm-parchment/50 focus-within:border-terracotta-clay focus-within:ring-2 focus-within:ring-terracotta-clay/15 transition-all duration-200">
                  <div className="pl-4 pr-1 text-warm-gray flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-lg">lock</span>
                  </div>
                  <input className="w-full h-12 bg-transparent border-0 text-charcoal-ink text-sm placeholder:text-warm-gray/60 focus:ring-0 px-2 pr-11 outline-none" id="password" name="password" placeholder="••••••••••••" required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button aria-label="Toggle password visibility" className="absolute right-3 p-1 text-warm-gray hover:text-charcoal-ink focus:outline-none transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded text-terracotta-clay border-border-subtle focus:ring-terracotta-clay focus:ring-offset-0 transition-colors" name="remember" type="checkbox"/>
                  <span className="text-sm text-charcoal-ink">Keep my kitchen logged in</span>
                </label>
                <span className="text-[11px] text-cardamom-emerald bg-cardamom-soft px-2 py-0.5 rounded font-medium">Safe &amp; Private</span>
              </div>
              {/* Primary Submit CTA */}
              <button disabled={loading} className="w-full min-h-[52px] bg-saffron-amber hover:bg-terracotta-clay active:scale-[0.99] disabled:opacity-70 text-surface-pure text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer" type="submit">
                <span>{loading ? 'Logging In...' : 'Log In to Aaj Kya Banaun?'}</span>
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-surface-pure px-4 text-warm-gray text-xs">
                  or continue with
                </span>
              </div>
            </div>
            {/* Google Fast Login Button */}
            <button className="w-full min-h-[48px] bg-warm-parchment hover:bg-surface-pure border border-border-subtle hover:border-terracotta-clay/40 rounded-lg text-sm text-charcoal-ink font-semibold flex items-center justify-center gap-4 transition-all duration-150 active:scale-[0.99] cursor-pointer shadow-sm hover:shadow" type="button">
              {/* Google G Logo SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </button>
            {/* Register Link / Switch Action */}
            <div className="mt-6 text-center pt-2 border-t border-border-subtle/60">
              <p className="text-sm text-warm-gray">
                New to Aaj Kya Banaun?
                <Link className="text-terracotta-clay hover:text-primary font-semibold underline-offset-2 hover:underline ml-1 inline-flex items-center gap-0.5" href="/register">
                  <span>Create an Account / Register</span>
                  <span className="material-symbols-outlined text-sm">north_east</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Clean Bottom Culinary Footer Accent */}
      <footer className="w-full max-w-5xl mx-auto py-2 px-4 text-center text-warm-gray">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <span>© 2025 Aaj Kya Banaun? (آج کیا بناؤں؟)</span>
          <span>•</span>
          <a className="hover:text-terracotta-clay transition-colors" href="#">Ghar Ke Recipes</a>
          <span>•</span>
          <a className="hover:text-terracotta-clay transition-colors" href="#">Privacy &amp; Family Promise</a>
          <span>•</span>
          <a className="hover:text-terracotta-clay transition-colors" href="#">Urdu / English</a>
        </div>
      </footer>
    </div>
  );
}
