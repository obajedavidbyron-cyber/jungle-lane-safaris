import React, { useState } from 'react';
import { CONTACT_INFO } from '../../data/safariData';
import { Phone, Mail, MapPin, MessageSquare, Facebook, Instagram, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react';

export const ContactUsView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const faqs = [
    {
      q: 'Do I need a Visa or Yellow Fever Vaccination for Kenya?',
      a: 'Travelers to Kenya require an Electronic Travel Authorization (eTA) obtained online prior to departure at etakenya.go.ke. Yellow Fever vaccination is required if arriving from or transiting through endemic countries.'
    },
    {
      q: 'What is included in Jungle Lane Safaris package prices?',
      a: 'All our multi-day packages include transport in private 4x4 Land Cruisers with pop-up roofs, full board accommodation, all park entrance fees, professional English/Swahili driver-guide services, and unlimited drinking water.'
    },
    {
      q: 'Can I customize an itinerary for my family or budget?',
      a: 'Yes! 100% of our trips are tailor-made. Whether you prefer luxury fly-in camps, mid-range lodges, or budget tented camps, we customize every detail to match your schedule and preferences.'
    },
    {
      q: 'What payment options do you accept?',
      a: 'We accept secure international Bank Wire Transfers (USD/EUR/GBP), Credit/Debit Card online payments via secure gateway, and local M-Pesa for guests in Kenya.'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 bg-[#F9F6F0] min-h-screen space-y-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-[#2E4057] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-[#3A4F68]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-[#C86D51] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              We are Here in Nairobi, Kenya
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Contact Jungle Lane Safaris
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Have questions or ready to plan your trip? Reach out via WhatsApp, phone, or email. Our Nairobi team is on standby to assist you.
            </p>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Phone & WhatsApp */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#222222]">Direct Phone & WhatsApp</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Talk directly with our safari coordinators for instant replies and itinerary quotes.
            </p>
            <div className="pt-2 space-y-2 text-xs font-semibold">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-emerald-600 hover:underline"
              >
                WhatsApp: {CONTACT_INFO.whatsappNumber} ({CONTACT_INFO.phoneDisplay})
              </a>
              <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="block text-[#2E4057] hover:underline">
                Call Us: {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-[#C86D51]">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#222222]">Email Inquiry</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Send us your detailed travel requirements, dates, and group size for a written proposal.
            </p>
            <div className="pt-2 text-xs font-semibold">
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#C86D51] hover:underline block">
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>

          {/* Card 3: Socials & Office */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-4">
            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-[#2E4057]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#222222]">Nairobi Office Address</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {CONTACT_INFO.address}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={CONTACT_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#2E4057] text-white hover:bg-[#C86D51]"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#2E4057] text-white hover:bg-[#C86D51]"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-md">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#C86D51] uppercase tracking-wider block">
                Send a Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
                Let's Start Planning Your Safari
              </h2>
            </div>

            {formSent ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-emerald-900">Message Received!</h3>
                <p className="text-xs text-stone-700">
                  Thank you <strong>{formData.name}</strong>. Our safari booking office in Nairobi will respond to <strong>{formData.email}</strong> within 1 hour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F9F6F0] border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#C86D51] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#F9F6F0] border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#C86D51] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., +1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Message / Travel Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us your proposed travel dates, destinations, and guests count..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F9F6F0] border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2E4057] hover:bg-[#1E2B22] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C86D51]" />
                  <span>Send Message to Jungle Lane Safaris</span>
                </button>
              </form>
            )}
          </div>

          {/* Map/Location Card */}
          <div className="bg-[#2E4057] text-white p-8 rounded-2xl space-y-6">
            <h3 className="font-serif font-bold text-xl">Visit Our Nairobi Office</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Located in Nairobi City Centre, Kimathi Street. We welcome walk-in guests for face-to-face safari consultations and airport transfers.
            </p>

            <div className="bg-[#3A4F68]/60 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <MapPin className="w-4 h-4 text-[#C86D51]" />
                <span>Nairobi City Centre • Kimathi Street</span>
              </div>
              <div>Office Hours: Mon - Sat: 8:00 AM - 6:00 PM (EAT)</div>
              <div>24/7 Emergency Safari Support Line Active</div>
            </div>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-center text-xs shadow"
            >
              Open Direct WhatsApp Chat
            </a>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
            Frequently Asked Safari Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-serif font-bold text-sm sm:text-base text-[#222222] flex items-center justify-between bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#C86D51]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-white text-xs text-stone-700 leading-relaxed border-t border-stone-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
