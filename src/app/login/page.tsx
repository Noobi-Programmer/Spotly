'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle2, MapPin, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCodeSent(true);
    }, 600);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const user = email || 'student@sst.scaler.com';
      setLoggedInUser(user);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#a6d29b', '#c5cc7b', '#ffffff'],
      });
      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const user = 'sst.student@scaler.com';
      setLoggedInUser(user);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#a6d29b', '#c5cc7b', '#4285F4'],
      });
      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#001801] text-[#c2efb6] flex items-center justify-center relative overflow-hidden font-inter p-4">
      {/* Back Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs text-[#a6d29b] hover:text-[#c5cc7b] font-sora font-semibold bg-[#012603] px-3.5 py-2 rounded-xl border border-[#31572c] shadow-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Spotly</span>
      </Link>

      {/* Atmospheric Background Layers from Stitch HTML */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(166,210,155,0.15)_0%,rgba(0,24,1,0)_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(197,204,123,0.1)_0%,rgba(0,24,1,0)_70%)] rounded-full top-[20%] right-[-10%]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #c1eeb5 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[440px] z-10 relative flex flex-col items-center">
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#173c15] flex items-center justify-center mb-3 border border-[#42493f]/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <MapPin className="w-6 h-6 text-[#c1eeb5] fill-[#c1eeb5]" />
          </div>
          <h1 className="font-sora text-4xl font-bold text-[#c2efb6] mb-1 tracking-tight text-center">
            Spotly
          </h1>
          <p className="font-inter text-base text-[#c2c9bc] text-center">
            Intelligent campus spatial awareness.
          </p>
        </div>

        {/* Glass Card */}
        <div className="rounded-[24px] p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] w-full bg-[rgba(23,60,21,0.4)] backdrop-blur-2xl border border-[rgba(193,238,181,0.1)] relative">
          {loggedInUser ? (
            <div className="py-6 flex flex-col items-center text-center gap-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-[#c1eeb5] text-[#123810] flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h2 className="font-sora text-xl font-bold text-[#c2efb6]">
                Welcome, {loggedInUser}!
              </h2>
              <p className="text-xs text-[#a6d29b] font-inter">
                Taking you to live campus spaces...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="font-sora text-2xl font-bold text-[#c2efb6] mb-1">
                  Welcome back.
                </h2>
                <p className="font-inter text-sm text-[#c2c9bc]">
                  Sign in to find your spot.
                </p>
              </div>

              {/* Primary Google Action */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-[#001801] text-[#c2efb6] py-3.5 px-4 rounded-xl border border-[#42493f] hover:border-[#c1eeb5] transition-colors duration-300 mb-5 font-inter font-semibold text-sm group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#c1eeb5] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-[#42493f]/30 flex-1" />
                <span className="font-inter text-xs text-[#c2c9bc] uppercase tracking-wider font-medium">
                  or use your campus email
                </span>
                <div className="h-px bg-[#42493f]/30 flex-1" />
              </div>

              {/* Email Form */}
              {!codeSent ? (
                <form onSubmit={handleSendCode} className="flex flex-col gap-3">
                  <div>
                    <label className="block font-inter text-xs font-semibold text-[#c2c9bc] mb-1.5" htmlFor="email">
                      SST Email ID
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c9387] w-4 h-4" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username-sst.scaler.com"
                        className="w-full bg-[#002202] border border-[#42493f]/50 rounded-xl py-3 pl-10 pr-4 text-[#c2efb6] placeholder:text-[#8c9387] focus:border-[#c1eeb5] focus:ring-1 focus:ring-[#c1eeb5] transition-all duration-300 font-inter text-sm outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#c1eeb5] text-[#123810] py-3.5 px-4 rounded-xl font-sora font-bold text-sm hover:bg-[#a6d29b] transition-colors duration-300 mt-2 flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-[#c1eeb5]/20"
                  >
                    <span>{isSubmitting ? 'Sending Code...' : 'Send Login Code'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="flex flex-col gap-3 animate-in fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-inter text-xs font-semibold text-[#c2c9bc]" htmlFor="code">
                        Enter 4-Digit Passcode
                      </label>
                      <span className="text-[11px] text-[#c1eeb5] font-mono">Demo: 1234</span>
                    </div>
                    <input
                      id="code"
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold bg-[#002202] border border-[#c1eeb5] rounded-xl py-3 px-4 text-[#c2efb6] placeholder:text-[#8c9387] focus:border-[#c1eeb5] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd8e4] text-[#511f36] py-3.5 px-4 rounded-xl font-sora font-bold text-sm hover:bg-[#fcb1cd] transition-colors duration-300 mt-2 flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-[#ffd8e4]/20"
                  >
                    <span>{isSubmitting ? 'Verifying...' : 'Verify & Enter Spotly'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="font-inter text-xs text-[#c2c9bc]">
                  New to Spotly? Your SST account is already active.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
