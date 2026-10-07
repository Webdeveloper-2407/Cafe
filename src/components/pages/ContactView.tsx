import React, { useState } from 'react';
import { CafeLeafIcon } from '../common/CafeLeafIcon.js';
import { api } from '../../services/api.js';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send } from 'lucide-react';

export function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.sendContact(formData);
      setSuccessMsg(res.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF4ED] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE0D2]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="flex justify-center mb-2">
            <CafeLeafIcon className="w-7 h-7 text-[#734A2E]" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#785135] mb-2">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810] tracking-tight mb-3">
            Contact & Location
          </h1>
          <p className="text-xs sm:text-sm text-[#664C39] leading-relaxed">
            Have an inquiry about event hosting, wholesale coffee, catering, or dietary questions? We’d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Details & Info */}
          <div className="lg:col-span-5 bg-[#FAF5EF] border border-[#EDE2D4] rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
              Café Headquarters
            </h2>
            <p className="text-xs text-[#6B513E] leading-relaxed">
              Nestled on the cobblestone avenue, we invite you to take a seat, enjoy the roasted aromas, and soak in the warmth.
            </p>

            <div className="space-y-4 text-xs text-[#523A2B] pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6B4226] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2C1810] block">Address</span>
                  <span>142 Espresso Avenue, Heritage Quarter, NY 10012</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#6B4226] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2C1810] block">Opening Hours</span>
                  <span>Monday – Sunday: 7:00 AM – 9:00 PM</span>
                  <span className="text-[#8C715E] block text-[11px]">Holidays: 8:00 AM – 8:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#6B4226] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2C1810] block">Phone</span>
                  <span>+1 (555) 724-2026</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#6B4226] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2C1810] block">Email</span>
                  <span>hello@artisan-cafe.com</span>
                </div>
              </div>
            </div>

            {/* Visual Location Map Preview */}
            <div className="pt-2">
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#D8C7B5] relative bg-[#EDE3D6] flex items-center justify-center text-center p-4">
                <div className="space-y-1">
                  <MapPin className="w-8 h-8 text-[#6B4226] mx-auto animate-bounce" />
                  <p className="font-serif text-sm font-bold text-[#2C1810]">
                    142 Espresso Avenue
                  </p>
                  <p className="text-[11px] text-[#7A5B46]">Heritage Quarter · Subway: Green Line</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7 bg-[#FAF5EF] border border-[#EDE2D4] rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
              Send Us a Message
            </h2>

            {successMsg ? (
              <div className="py-10 text-center space-y-3 bg-[#FAF4ED] p-6 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#2C1810]">Message Received!</h3>
                <p className="text-xs text-[#523A2B]">{successMsg}</p>
                <button
                  onClick={() => setSuccessMsg(null)}
                  className="mt-4 px-5 py-2 rounded-full text-xs font-bold text-[#6B4226] border border-[#6B4226] hover:bg-[#6B4226] hover:text-white transition-all uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A3223] mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Catering inquiry, feedback, etc."
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#4A3223] mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you have in mind..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D8C7B5] text-[#2C1810] focus:outline-none focus:ring-1 focus:ring-[#734A2E]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-xs font-bold tracking-widest text-[#FFF8F0] bg-[#6B4226] hover:bg-[#52331B] disabled:opacity-50 active:scale-95 transition-all uppercase shadow-sm cursor-pointer"
                  >
                    <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
