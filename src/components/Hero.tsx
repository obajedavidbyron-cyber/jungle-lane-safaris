import React, { useState } from 'react';
import { Search, MapPin, Calendar, Compass, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { FilterState } from '../types';
import { CONTACT_INFO } from '../data/safariData';
import { tracker } from '../lib/tracker';

interface HeroProps {
  onSearch: (filters: FilterState) => void;
  onOpenQuoteModal: () => void;
  onOpenAIModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenQuoteModal, onOpenAIModal }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [travelStyle, setTravelStyle] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParts = [destination, duration ? `${duration} Days` : '', travelStyle].filter(Boolean);
    const searchQuery = queryParts.length > 0 ? queryParts.join(' ') : 'All Kenya Safaris';
    tracker.search(searchQuery);

    if (destination) tracker.destinationView(destination);
    if (duration) tracker.filterUsage('Duration', duration);
    if (travelStyle) tracker.filterUsage('Travel Style', travelStyle);

    onSearch({ destination, duration, travelStyle });
  };

  return (
    <div className="relative min-h-[88vh] flex items-center justify-center bg-[#3A4F41] overflow-hidden">
      {/* High-Res Hero Image Background with Warm Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/jungle_lane_hero_1784824345971.jpg"
          alt="Jungle Lane Safaris Maasai Mara Lion Safari"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3A4F41] via-transparent to-black/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-white w-full">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C86D51] px-4 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-widest text-white shadow-md">
            <Compass className="w-4 h-4 animate-spin-slow text-amber-200" />
            <span>LICENSED KENYA SAFARI OPERATOR</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] drop-shadow-md">
            Explore Africa <br className="hidden sm:inline" />
            <span className="text-[#E29578] italic font-normal">with Africans</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-stone-200 font-light leading-relaxed max-w-2xl drop-shadow">
            Unforgettable wildlife safaris, tailor-made adventures, and seamless day excursions across East Africa.
          </p>

          {/* Quick Value Props */}
          <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs uppercase tracking-wider text-stone-300 font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C86D51]" />
              <span>Native Maasai & Driver Guides</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C86D51]" />
              <span>4x4 Pop-Up Roof Land Cruisers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C86D51]" />
              <span>100% Customized Itineraries</span>
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onOpenQuoteModal();
                tracker.bookmarkItinerary('Hero Request Custom Itinerary CTA');
              }}
              className="bg-[#C86D51] hover:bg-[#b05a41] text-white px-6 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Request Custom Itinerary
            </button>
            <button
              onClick={() => {
                onOpenAIModal();
                tracker.pageView('AI Safari Advisor Hero Button');
              }}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-5 py-3.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Safari Advisor</span>
            </button>
            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker.outboundClick('Hero WhatsApp Direct Button', 'WhatsApp', CONTACT_INFO.whatsappUrl);
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-3.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Interactive Search / Filter Widget */}
        <div className="mt-10 sm:mt-14 bg-white p-5 sm:p-7 rounded-sm shadow-2xl border-l-4 border-[#C86D51] text-[#222222]">
          <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#3A4F41] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#C86D51]" />
              <span>Find Your Ideal Kenya Safari</span>
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 hidden sm:inline">
              Instant filtering across our top rated packages
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-stone-300 rounded-sm py-2.5 px-3 text-xs font-semibold text-[#222222] focus:ring-2 focus:ring-[#C86D51] focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">All Destinations</option>
                <option value="Maasai Mara">Maasai Mara</option>
                <option value="Amboseli">Amboseli (Mt. Kilimanjaro)</option>
                <option value="Lake Nakuru">Lake Nakuru & Naivasha</option>
                <option value="Samburu">Samburu Reserve</option>
                <option value="Diani Beach">Coastal Kenya & Diani</option>
                <option value="Nairobi">Nairobi Day Trips</option>
              </select>
            </div>

            {/* Duration Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C86D51]" />
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-stone-300 rounded-sm py-2.5 px-3 text-xs font-semibold text-[#222222] focus:ring-2 focus:ring-[#C86D51] focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">Any Duration</option>
                <option value="1">1 Day Excursion</option>
                <option value="3-5">3 - 5 Days</option>
                <option value="7+">7+ Days (Extended / Beach)</option>
              </select>
            </div>

            {/* Travel Style */}
            <div className="relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#C86D51]" />
                Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-stone-300 rounded-sm py-2.5 px-3 text-xs font-semibold text-[#222222] focus:ring-2 focus:ring-[#C86D51] focus:border-transparent outline-none cursor-pointer"
              >
                <option value="">All Styles</option>
                <option value="Budget">Budget Tented Camps</option>
                <option value="Mid-Range">Mid-Range Lodges</option>
                <option value="Luxury">Luxury Fly-In Safari</option>
                <option value="Private Group">Private Family / Group</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#3A4F41] hover:bg-[#2B3B30] text-white py-2.5 px-4 rounded-sm font-bold text-xs uppercase tracking-widest shadow transition-colors flex items-center justify-center gap-2 cursor-pointer h-[42px]"
              >
                <Search className="w-4 h-4 text-[#C86D51]" />
                <span>Search Safaris</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

