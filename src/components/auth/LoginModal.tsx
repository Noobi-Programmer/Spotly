'use client';

import React, { useState } from 'react';
import { X, Mail, ArrowRight, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  if (!isOpen) return null;

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
      if (onLoginSuccess) onLoginSuccess(user);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3 },
        colors: ['#a6d29b', '#c5cc7b', '#ffffff'],
      });
      setTimeout(() => {
        onClose();
        setCodeSent(false);
        setVerificationCode('');
      }, 1500);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const user = 'sst.student@scaler.com';
      setLoggedInUser(user);
      if (onLoginSuccess) onLoginSuccess(user);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.3 },
        colors: ['#a6d29b', '#c5cc7b', '#4285F4'],
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Ambient Glows from Stitch HTML */}
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(166,210,155,0.15)_0%,rgba(0,24,1,0)_70%)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(197,204,123,0.1)_0%,rgba(0,24,1,0)_70%)] rounded-full top-[20%] right-[-10%] pointer-events-none" />

      {/* Main Login Container */}
      <div className="relative w-full max-w-[440px] z-10 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 right-0 p-2.5 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border border-primary-container/40 z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-surface-variant flex items-center justify-center mb-3 border border-outline-variant/30 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <MapPin className="w-6 h-6 text-primary fill-primary" />
          </div>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-on-surface mb-1 tracking-tight text-center">
            Spotly
          </h1>
          <p className="font-inter text-sm sm:text-base text-on-surface-variant text-center">
            Intelligent campus spatial awareness.
          </p>
        </div>

        {/* Glass Card */}
        <div className="w-full rounded-[24px] p-6 sm:p-8 bg-[#173c15]/40 backdrop-blur-2xl border border-primary/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
          {loggedInUser ? (
            <div className="py-6 flex flex-col items-center text-center gap-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="font-sora text-lg font-bold text-on-surface">
                Welcome, {loggedInUser}!
              </h3>
              <p className="text-xs text-primary font-inter">
                Your SST session is verified and ready.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="font-sora text-xl sm:text-2xl font-bold text-on-surface mb-1">
                  Welcome back.
                </h2>
                <p className="font-inter text-sm text-on-surface-variant">
                  Sign in to find your spot.
                </p>
              </div>

              {/* Primary Google Action */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-surface text-on-surface py-3.5 px-4 rounded-xl border border-outline-variant hover:border-primary transition-colors duration-300 mb-5 font-inter font-semibold text-sm group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                {/* Google Icon SVG */}
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
                <div className="h-px bg-outline-variant/30 flex-1" />
                <span className="font-inter text-xs text-on-surface-variant uppercase tracking-wider font-medium">
                  or use your campus email
                </span>
                <div className="h-px bg-outline-variant/30 flex-1" />
              </div>

              {/* Email Form */}
              {!codeSent ? (
                <form onSubmit={handleSendCode} className="flex flex-col gap-3">
                  <div>
                    <label className="block font-inter text-xs font-semibold text-on-surface-variant mb-1.5" htmlFor="email">
                      SST Email ID
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username-sst.scaler.com"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-inter text-sm outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl font-sora font-bold text-sm hover:bg-primary-container transition-colors duration-300 mt-2 flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-primary/20"
                  >
                    <span>{isSubmitting ? 'Sending Code...' : 'Send Login Code'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="flex flex-col gap-3 animate-in fade-in">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-inter text-xs font-semibold text-on-surface-variant" htmlFor="code">
                        Enter 4-Digit Passcode
                      </label>
                      <span className="text-[11px] text-primary font-mono">Demo: 1234</span>
                    </div>
                    <input
                      id="code"
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold bg-surface-container-low border border-primary rounded-xl py-3 px-4 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-tertiary text-on-tertiary py-3 px-4 rounded-xl font-sora font-bold text-sm hover:bg-tertiary-fixed transition-colors duration-300 mt-2 flex items-center justify-center gap-2 group cursor-pointer shadow-md shadow-tertiary/20"
                  >
                    <span>{isSubmitting ? 'Verifying...' : 'Verify & Enter Spotly'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="font-inter text-xs text-on-surface-variant">
                  New to Spotly? Your SST account is already active.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
