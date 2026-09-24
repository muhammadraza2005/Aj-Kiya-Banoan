'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    setErrorMsg('');
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
      
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-warm-parchment flex items-center justify-center p-4 selection:bg-turmeric-glow selection:text-terracotta-clay">
      <div className="bg-surface-pure border border-border-subtle rounded-2xl p-6 shadow-xl w-full max-w-sm">
        <h1 className="font-serif text-2xl font-bold text-charcoal-ink text-center mb-2">Aaj Kya Banaun?</h1>
        <p className="text-sm text-warm-gray text-center mb-6">Log in to save your family&apos;s favorites</p>
        
        {errorMsg && <p className="text-xs text-terracotta-clay bg-terracotta-clay/10 p-2 rounded mb-4">{errorMsg}</p>}
        
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-warm-parchment border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-amber/50 transition-all"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-warm-parchment border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-amber/50 transition-all"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          
          <button
            onClick={() => handleAuth(false)}
            disabled={loading}
            className="w-full bg-saffron-amber hover:bg-terracotta-clay text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          <button
            onClick={() => handleAuth(true)}
            disabled={loading}
            className="w-full bg-transparent hover:bg-surface-container border border-border-subtle text-charcoal-ink font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 text-sm"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
