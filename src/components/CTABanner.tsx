import React from 'react';
import { MessageSquare, Calendar, PhoneCall, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';

interface CTABannerProps {
  onOpenQuoteModal: () => void;
  onOpenAIModal: () => void;
}

export const CTABanner: React.FC<CTABannerProps> = ({ onOpenQuoteModal, onOpenAIModal }) => {
  return (
    <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-[#3A4F41] via-[#2D3E33] to-[#1E2B22] text-white relative overflow-hidden">
      {/* Warm Background Graphic Details */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C86D51]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#C86D51] text-white px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-widest shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>Tailor-Made Kenya Travel Experts</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
          Ready to Plan Your Dream African Safari?
        </h2>

        <p className="text-stone-200 text-lg sm:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
          Talk directly with our local travel experts to craft a personalized itinerary that fits your schedule, interests, and budget.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2.5 group"
          >
            <MessageSquare className="w-4 h-4 fill-white text-white" />
            <span>WhatsApp Us ({CONTACT_INFO.whatsappNumber})</span>
          </a>

          <button
            onClick={onOpenQuoteModal}
            className="w-full sm:w-auto bg-[#C86D51] hover:bg-[#b05a41] text-white px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Request Custom Itinerary</span>
          </button>
        </div>

        {/* Direct Contact Info Line */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300 font-medium">
          <a href={`tel:${CONTACT_INFO.phoneRaw}`} className="flex items-center gap-1.5 hover:text-[#E29578] transition-colors">
            <PhoneCall className="w-3.5 h-3.5 text-[#C86D51]" />
            <span>Call Us: {CONTACT_INFO.phoneDisplay}</span>
          </a>
          <span>•</span>
          <span>Email: {CONTACT_INFO.email}</span>
          <span>•</span>
          <span>No Obligation Free Travel Quotes</span>
        </div>
      </div>
    </section>
  );
};
