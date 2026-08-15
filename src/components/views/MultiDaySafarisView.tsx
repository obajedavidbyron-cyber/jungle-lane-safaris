import React, { useState } from 'react';
import { SAFARI_PACKAGES, CONTACT_INFO } from '../../data/safariData';
import { SafariPackage } from '../../types';
import { MapPin, Clock, CheckCircle, ChevronRight, MessageSquare, Filter } from 'lucide-react';

interface MultiDaySafarisViewProps {
  onSelectPackage: (pkg: SafariPackage) => void;
  onOpenQuoteModal: (title?: string) => void;
}

export const MultiDaySafarisView: React.FC<MultiDaySafarisViewProps> = ({
  onSelectPackage,
  onOpenQuoteModal
}) => {
  const [durationFilter, setDurationFilter] = useState<'all' | '3-5' | '7+'>('all');

  const multiDayPackages = SAFARI_PACKAGES.filter((p) => {
    if (p.category === 'day') return false;
    if (durationFilter === '3-5' && (p.durationDays < 3 || p.durationDays > 5)) return false;
    if (durationFilter === '7+' && p.durationDays < 7) return false;
    return true;
  });

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 bg-[#F9F6F0] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="bg-[#2E4057] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xl border border-[#3A4F68]">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-[#C86D51] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Multi-Day Wildlife Expeditions
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Multi-Day Kenya & East Africa Safaris
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Experience the raw African wilderness. Traverse Maasai Mara, Amboseli, Lake Nakuru, and Samburu in customized 4x4 Land Cruisers with pop-up roofs.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2E4057] uppercase">
            <Filter className="w-4 h-4 text-[#C86D51]" />
            <span>Filter Duration:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDurationFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                durationFilter === 'all' ? 'bg-[#2E4057] text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              All Multi-Day
            </button>
            <button
              onClick={() => setDurationFilter('3-5')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                durationFilter === '3-5' ? 'bg-[#2E4057] text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              3 - 5 Days
            </button>
            <button
              onClick={() => setDurationFilter('7+')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                durationFilter === '7+' ? 'bg-[#2E4057] text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              7+ Days (Extended & Beach)
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {multiDayPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-stone-200 flex flex-col group"
            >
              <div className="relative h-64 bg-stone-900">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C86D51] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {pkg.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-[#2E4057]/90 text-white px-4 py-1.5 rounded-xl">
                  <span className="text-xl font-serif font-bold text-amber-300">${pkg.priceFromUSD}</span>
                  <span className="text-xs text-stone-300"> / person</span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-stone-200 text-xs font-semibold bg-black/60 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                  <span>{pkg.durationLabel}</span>
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
                    <span>Full Itinerary</span>
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
      </div>
    </div>
  );
};
