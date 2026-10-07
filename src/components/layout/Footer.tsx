import React, { useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { Instagram, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.js';

interface FooterProps {
  onNavigateAdmin: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export function Footer({ onNavigateAdmin, onOpenPrivacy, onOpenTerms }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      setStatus({ type: 'loading', message: '' });
      const res = await api.subscribeNewsletter(email);
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Subscription failed. Please try again.' });
    }
  };

  return (
    <footer className="bg-[#EFE7DE] border-t border-[#DFD3C3] text-[#523A2B] pt-14 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Newsletter & Socials Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-[#E0D4C5]">
          
          {/* Left: Icon & Description */}
          <div className="lg:col-span-5 flex items-start gap-4">
            <div className="shrink-0 mt-1">
              <CafeLeafIcon className="w-8 h-8 text-[#734A2E]" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C1810] mb-1">
                Stay in the Loop
              </h3>
              <p className="text-xs text-[#6B513E] leading-relaxed max-w-xs font-normal">
                Subscribe to get updates on new menu items, special offers, and events.
              </p>
            </div>
          </div>

          {/* Center: Email input + SUBSCRIBE button */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full sm:w-64 px-4 py-2.5 rounded-full bg-[#FAF5EF] border border-[#D8C7B5] text-xs text-[#2C1810] placeholder:text-[#9C8270] focus:outline-none focus:ring-1 focus:ring-[#734A2E] shadow-inner"
              />
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#54331B] disabled:opacity-50 active:scale-95 transition-all uppercase cursor-pointer whitespace-nowrap shadow-sm"
              >
                {status.type === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
            </form>
            {status.message && (
              <p
                className={`text-[11px] mt-2 font-medium ${
                  status.type === 'success' ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {status.message}
              </p>
            )}
          </div>

          {/* Right: Follow Us */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-end">
            <span className="font-serif text-sm font-bold text-[#2C1810] mb-2.5">
              Follow Us
            </span>
            <div className="flex items-center gap-3 text-[#6B513E]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2C1810] transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2C1810] transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2C1810] transition-colors p-1"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#2C1810] transition-colors p-1"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.379l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom row: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6150]">
          <div>
            © 2026 Café. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#2C1810] transition-colors focus:outline-none"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-[#2C1810] transition-colors focus:outline-none"
            >
              Terms & Conditions
            </button>
            <button
              onClick={onNavigateAdmin}
              className="inline-flex items-center gap-1 text-[#6B4226] hover:text-[#3B2212] font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
