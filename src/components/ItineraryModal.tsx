import React, { useState } from 'react';
import { X, Clock, MapPin, CheckCircle, XCircle, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { SafariPackage } from '../types';
import { CONTACT_INFO } from '../data/safariData';

interface ItineraryModalProps {
  pkg: SafariPackage | null;
  onClose: () => void;
  onOpenQuoteModal: (packageTitle?: string) => void;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({ pkg, onClose, onOpenQuoteModal }) => {
  if (!pkg) return null;

  const [guests, setGuests] = useState(2);
  const estimatedTotalUSD = pkg.priceFromUSD * guests;

  const whatsappMessage = `Jambo Jungle Lane Safaris! I want to inquire/book the "${pkg.title}" for ${guests} traveler(s). Estimated Total: $${estimatedTotalUSD}. Please send me available dates and custom booking details.`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#F9F6F0] rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto border border-stone-300 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-80 bg-stone-900">
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-sm transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#C86D51] text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest">
                {pkg.tag}
              </span>
              <span className="bg-[#3A4F41] text-white text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                {pkg.durationLabel}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
              {pkg.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-stone-200 font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#C86D51]" />
              <span>{pkg.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Price Estimator & Quick Inquire Strip */}
          <div className="bg-[#3A4F41] text-white p-6 rounded-sm shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-stone-300 uppercase tracking-widest font-bold block">
                Package Price Starting From
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-bold text-amber-300">
                  ${pkg.priceFromUSD}
                </span>
                <span className="text-xs text-stone-300">/ person (twin sharing)</span>
              </div>
              <span className="text-[11px] text-[#E29578] font-bold uppercase tracking-wider">
                100% Tailor-Made & Price Guarantee
              </span>
            </div>

            {/* Quick Guest Selector */}
            <div className="flex items-center gap-3 bg-[#2D3E33] p-2.5 rounded-sm border border-[#3A4F41]">
              <span className="text-xs text-stone-200 font-bold uppercase tracking-wider">Travelers:</span>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-[#3A4F41] text-white border border-[#2D3E33] rounded-sm px-2 py-1 text-xs font-bold"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? 's' : ''} (${pkg.priceFromUSD * num})
                  </option>
                ))}
              </select>
            </div>

            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-lg font-serif font-bold text-[#222222]">Safari Overview</h3>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {pkg.shortDescription}
            </p>
          </div>

          {/* Day-by-Day Timeline */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-[#222222] border-b border-stone-300 pb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C86D51]" />
              <span>Day-by-Day Itinerary Timeline</span>
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-[#C86D51]/30">
              {pkg.dayByDay.map((dayItem) => (
                <div key={dayItem.day} className="relative pl-10 space-y-2">
                  <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-[#3A4F41] text-white flex items-center justify-center text-xs font-bold shadow border-2 border-[#F9F6F0]">
                    D{dayItem.day}
                  </div>

                  <div className="bg-white p-5 rounded-sm border border-stone-200/80 shadow-sm space-y-2">
                    <h4 className="font-serif font-bold text-base text-[#222222]">
                      Day {dayItem.day}: {dayItem.title}
                    </h4>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {dayItem.description}
                    </p>

                    {(dayItem.overnight || dayItem.meals) && (
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 border-t border-stone-100 font-medium">
                        {dayItem.overnight && (
                          <span>
                            🏡 <strong className="text-stone-700">Stay:</strong> {dayItem.overnight}
                          </span>
                        )}
                        {dayItem.meals && (
                          <span>
                            🍽️ <strong className="text-stone-700">Meals Included:</strong> {dayItem.meals}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-100 p-6 rounded-sm border border-stone-200">
            {/* Inclusions */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Package Inclusions</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-700">
                {pkg.inclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Exclusions</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-700">
                {pkg.exclusions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-stone-300 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                const title = pkg.title;
                onClose();
                onOpenQuoteModal(title);
              }}
              className="w-full sm:w-1/2 bg-[#C86D51] hover:bg-[#b05a41] text-white py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors text-center shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Customize This Itinerary</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors text-center shadow flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Book via WhatsApp ({CONTACT_INFO.whatsappNumber})</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
