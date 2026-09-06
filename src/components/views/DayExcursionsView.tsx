import React from 'react';
import { SAFARI_PACKAGES } from '../../data/safariData';
import { SafariPackage } from '../../types';
import { Clock, MapPin, CheckCircle, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../../data/safariData';

interface DayExcursionsViewProps {
  onSelectPackage: (pkg: SafariPackage) => void;
  onOpenQuoteModal: (title?: string) => void;
}

export const DayExcursionsView: React.FC<DayExcursionsViewProps> = ({
  onSelectPackage,
  onOpenQuoteModal
}) => {
  const dayExcursions = SAFARI_PACKAGES.filter((p) => p.category === 'day' || p.durationDays === 1);

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 bg-[#F9F6F0] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-[#2E4057] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-[#3A4F68]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-[#C86D51] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              1-Day Nairobi & Rift Valley Excursions
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Seamless 1-Day Kenya Wildlife & Cultural Tours
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Perfect for layovers in Nairobi, business travelers, or quick weekend getaways. Includes private vehicle, park fees, local guide, and hotel pick-up.
            </p>
          </div>
        </div>

        {/* Excursions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dayExcursions.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 flex flex-col group"
            >
              <div className="relative h-60 bg-stone-900">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#2E4057] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {pkg.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#2E4057]/90 text-white px-3.5 py-1.5 rounded-xl">
                  <span className="text-xs font-bold text-amber-300">Inquire for Details</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#C86D51] font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{pkg.location}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#222222]">{pkg.title}</h3>
                  <p className="text-stone-600 text-xs leading-relaxed">{pkg.shortDescription}</p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Highlights:</span>
                    <ul className="space-y-1">
                      {pkg.keyHighlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex gap-3">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className="w-1/2 bg-[#2E4057] hover:bg-[#1E2B22] text-white py-2.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1"
                  >
                    <span>Itinerary</span>
                    <ChevronRight className="w-4 h-4 text-[#C86D51]" />
                  </button>
                  <a
                    href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(`Jambo! I want to inquire about the ${pkg.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Day Trip CTA */}
        <div className="bg-stone-200/80 p-8 rounded-2xl text-center space-y-4 max-w-2xl mx-auto border border-stone-300">
          <Sparkles className="w-8 h-8 text-[#C86D51] mx-auto" />
          <h3 className="text-xl font-serif font-bold text-[#222222]">Need a Tailor-Made Day Tour?</h3>
          <p className="text-stone-600 text-xs leading-relaxed">
            We can combine Nairobi National Park, Elephant Sanctuary, Giraffe Centre, Kiambethu Tea Farm, or Lake Naivasha into a customized 1-day schedule!
          </p>
          <button
            onClick={() => onOpenQuoteModal()}
            className="bg-[#C86D51] text-white px-6 py-3 rounded-xl font-bold text-xs shadow hover:bg-[#b05a41]"
          >
            Request Custom Day Excursion
          </button>
        </div>
      </div>
    </div>
  );
};
