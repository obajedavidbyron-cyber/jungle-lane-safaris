import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, ChevronRight, MessageSquare, Sparkles, Tag as TagIcon } from 'lucide-react';
import { SafariPackage, FilterState } from '../types';
import { SAFARI_PACKAGES, CONTACT_INFO } from '../data/safariData';

interface FeaturedPackagesProps {
  onSelectPackage: (pkg: SafariPackage) => void;
  onOpenQuoteModal: (packageTitle?: string) => void;
  activeFilter?: FilterState;
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  onSelectPackage,
  onOpenQuoteModal,
  activeFilter
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'day' | 'multi' | 'luxury'>('all');

  const filteredPackages = SAFARI_PACKAGES.filter((pkg) => {
    // Tab filter
    if (activeTab === 'day' && pkg.category !== 'day') return false;
    if (activeTab === 'multi' && pkg.category !== 'multi') return false;
    if (activeTab === 'luxury' && pkg.category !== 'luxury') return false;

    // Search filter from Hero Widget
    if (activeFilter) {
      if (
        activeFilter.destination &&
        !pkg.location.toLowerCase().includes(activeFilter.destination.toLowerCase()) &&
        !pkg.destinations.some((d) => d.toLowerCase().includes(activeFilter.destination.toLowerCase()))
      ) {
        return false;
      }

      if (activeFilter.duration) {
        if (activeFilter.duration === '1' && pkg.durationDays !== 1) return false;
        if (activeFilter.duration === '3-5' && (pkg.durationDays < 3 || pkg.durationDays > 5)) return false;
        if (activeFilter.duration === '7+' && pkg.durationDays < 7) return false;
      }
    }

    return true;
  });

  return (
    <section id="safari-packages" className="py-20 px-4 sm:px-8 bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-300 pb-8">
          <div>
            <div className="flex items-center gap-2 text-[#C86D51] text-xs font-bold uppercase tracking-widest mb-2">
              <TagIcon className="w-4 h-4" />
              <span>Handcrafted Itineraries</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#222222] tracking-tight">
              Featured Kenya Safaris & Excursions
            </h2>
            <p className="text-stone-600 mt-2 text-base sm:text-lg max-w-2xl">
              Authentic wildlife experiences led by local Maasai & Kenyan safari driver guides. Every package is 100% customizable.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-200/80 p-1.5 rounded-sm text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-sm transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#3A4F41] text-white shadow'
                  : 'text-stone-700 hover:text-[#222222]'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setActiveTab('multi')}
              className={`px-4 py-2 rounded-sm transition-all cursor-pointer ${
                activeTab === 'multi'
                  ? 'bg-[#3A4F41] text-white shadow'
                  : 'text-stone-700 hover:text-[#222222]'
              }`}
            >
              Multi-Day Safaris
            </button>
            <button
              onClick={() => setActiveTab('day')}
              className={`px-4 py-2 rounded-sm transition-all cursor-pointer ${
                activeTab === 'day'
                  ? 'bg-[#3A4F41] text-white shadow'
                  : 'text-stone-700 hover:text-[#222222]'
              }`}
            >
              Day Excursions
            </button>
            <button
              onClick={() => setActiveTab('luxury')}
              className={`px-4 py-2 rounded-sm transition-all cursor-pointer ${
                activeTab === 'luxury'
                  ? 'bg-[#3A4F41] text-white shadow'
                  : 'text-stone-700 hover:text-[#222222]'
              }`}
            >
              Luxury & Beach
            </button>
          </div>
        </div>

        {/* Packages Cards Grid */}
        {filteredPackages.length === 0 ? (
          <div className="bg-stone-100 p-12 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
            <Sparkles className="w-10 h-10 text-[#C86D51] mx-auto" />
            <h3 className="text-xl font-bold font-serif text-[#222222]">No packages matched your filter criteria</h3>
            <p className="text-stone-600 text-sm">
              We specialize in custom tailor-made itineraries. Tell us your dream destinations and we will create a personalized package for you!
            </p>
            <button
              onClick={() => onOpenQuoteModal()}
              className="bg-[#C86D51] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow hover:bg-[#b05a41] transition-all"
            >
              Request Custom Safari Quote
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 flex flex-col group"
              >
                {/* Image Container with Tag */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-stone-800">
                  <img
                    src={pkg.imageUrl}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Tag Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-md ${
                        pkg.tag === 'Best Seller'
                          ? 'bg-[#C86D51] text-white'
                          : pkg.tag === 'Luxury Choice'
                          ? 'bg-amber-600 text-white'
                          : pkg.tag === 'Day Excursion'
                          ? 'bg-[#3A4F41] text-white'
                          : 'bg-emerald-800 text-white'
                      }`}
                    >
                      {pkg.tag}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 right-4 bg-[#3A4F41]/90 backdrop-blur-md px-4 py-1.5 rounded-sm border border-white/20 text-white text-right">
                    <span className="block text-[10px] text-stone-300 uppercase font-bold tracking-wider">From</span>
                    <span className="text-xl sm:text-2xl font-bold font-serif text-amber-300">
                      ${pkg.priceFromUSD}
                    </span>
                    <span className="text-[10px] text-stone-300"> / person</span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-stone-200 text-xs font-semibold bg-black/60 backdrop-blur-md px-3 py-1 rounded-sm">
                    <Clock className="w-3.5 h-3.5 text-[#C86D51]" />
                    <span>{pkg.durationLabel}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C86D51]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{pkg.location}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#222222] group-hover:text-[#3A4F41] transition-colors leading-snug">
                      {pkg.title}
                    </h3>

                    <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                      {pkg.shortDescription}
                    </p>

                    {/* Highlights Bullets */}
                    <div className="pt-2 border-t border-stone-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                        Key Highlights:
                      </span>
                      <ul className="space-y-1.5">
                        {pkg.keyHighlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="w-full sm:w-1/2 bg-[#3A4F41] hover:bg-[#2B3B30] text-white py-2.5 px-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>View Itinerary</span>
                      <ChevronRight className="w-4 h-4 text-[#C86D51]" />
                    </button>

                    <a
                      href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                        `Jambo Jungle Lane Safaris! I am interested in booking or inquiring about the "${pkg.title}". Please send me details.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Inquiry</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
