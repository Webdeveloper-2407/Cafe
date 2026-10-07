import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { api } from '../../services/api.js';
import { AdminUser } from '../../types/index.js';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('admin@cafe.com');
  const [password, setPassword] = useState('adminpassword123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#7A5B46] hover:text-[#2C1810] hover:bg-[#EFE5D8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            Staff & Admin Portal
          </h2>
          <p className="text-xs text-[#6B513E] mt-1 font-normal">
            Manage café orders, live menu, table bookings, and customer communications.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#4A3223] mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7461]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#4A3223] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7461]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#F2E7DC] rounded-xl border border-[#DFD3C4] text-[11px] text-[#664C39] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#6B4226]" />
              <span>Default credentials pre-filled</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@cafe.com');
                setPassword('adminpassword123');
              }}
              className="text-[#6B4226] font-bold hover:underline"
            >
              Fill Demo
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] disabled:opacity-50 transition-all uppercase shadow-md cursor-pointer"
          >
            {loading ? 'SIGNING IN...' : 'ACCESS ADMIN PANEL'}
          </button>
        </form>
      </div>
    </div>
  );
}
