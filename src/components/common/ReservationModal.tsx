import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { CafeLeafIcon } from './CafeLeafIcon.js';
import { api } from '../../services/api.js';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '12:00',
    guests: 2,
    specialRequest: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.createReservation(formData);
      setSuccessMsg(res.message);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF4ED] border border-[#DFCFC0] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#73513C] hover:text-[#2C1810] hover:bg-[#EFE5D8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
            Reserve Your Table
          </h2>
          <p className="text-xs text-[#6B513E] mt-1 font-normal">
            Enjoy handcrafted espresso and fresh bakery in our cozy space.
          </p>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2C1810]">Reservation Requested!</h3>
            <p className="text-xs sm:text-sm text-[#5A3F2F] leading-relaxed max-w-sm mx-auto">
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#4A3223] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3223] mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#4A3223] mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#734A2E]" /> Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3223] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#734A2E]" /> Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4A3223] mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#734A2E]" /> Guests
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((num) => (
                    <option key={num} value={typeof num === 'number' ? num : 10}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#4A3223] mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A3223] mb-1">Special Requests (Optional)</label>
              <textarea
                rows={2}
                placeholder="High chair, window table, dietary notes, etc."
                value={formData.specialRequest}
                onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] disabled:opacity-50 transition-all uppercase shadow-md cursor-pointer"
              >
                {loading ? 'CONFIRMING...' : 'CONFIRM RESERVATION'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
