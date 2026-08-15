import React, { useState } from 'react';
import { MapPin, Calendar, Award, ChevronRight, Compass, Sparkles, X, Navigation, MessageSquare } from 'lucide-react';
import { Destination } from '../types';
import { DESTINATIONS, CONTACT_INFO } from '../data/safariData';
import { tracker } from '../lib/tracker';

interface DestinationShowcaseProps {
  onOpenQuoteModal: (destinationName?: string) => void;
}

export const DestinationShowcase: React.FC<DestinationShowcaseProps> = ({ onOpenQuoteModal }) => {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    tracker.destinationView(dest.name, {
      filterType: dest.famousFor,
      filterValue: dest.recommendedDuration
    });
  };

  return (
    <section id="destinations" className="py-20 px-4 sm:px-8 bg-[#F9F6F0]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[#C86D51] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>East Africa National Parks & Reserves</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#222222] tracking-tight">
            Explore Top Kenya Destinations
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            From the legendary golden savannas of Maasai Mara to the snow-capped peak of Mount Kilimanjaro in Amboseli and pristine white sand beaches of Diani.
          </p>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleSelectDestination(dest)}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border border-stone-200"
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity" />

              {/* Card Top Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="bg-[#3A4F41]/95 backdrop-blur-md text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-white/20">
                  {dest.famousFor}
                </span>
              </div>

              {/* Card Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Kenya • {dest.recommendedDuration}</span>
                </div>

                <h3 className="text-2xl font-serif font-bold group-hover:text-amber-200 transition-colors leading-tight">
                  {dest.name}
                </h3>

                <p className="text-stone-300 text-xs line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>

                {/* Highlights List */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {dest.highlights.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="bg-white/15 backdrop-blur-md text-stone-200 text-[11px] px-2.5 py-0.5 rounded-md font-medium border border-white/10"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#E29578] group-hover:text-white transition-colors">
                  <span>Explore Park Details</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Destination Detail Modal */}
        {selectedDestination && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#F9F6F0] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8 animate-in zoom-in-95 duration-200 border border-stone-300">
              {/* Modal Banner Header */}
              <div className="relative h-64 sm:h-80">
                <img
                  src={selectedDestination.imageUrl}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <button
                  onClick={() => setSelectedDestination(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="bg-[#C86D51] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedDestination.famousFor}
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-white pt-2">
                    {selectedDestination.name}
                  </h2>
                  <p className="text-stone-300 text-sm">{selectedDestination.tagline}</p>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-[#3A4F41] uppercase tracking-wider mb-2">
                    About this Destination
                  </h4>
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {selectedDestination.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-200/60 p-4 rounded-sm text-xs text-stone-800">
                  <div>
                    <span className="font-bold text-[#3A4F41] block mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C86D51]" />
                      Best Time to Visit:
                    </span>
                    <span>{selectedDestination.bestTimeToVisit}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#3A4F41] block mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#C86D51]" />
                      Recommended Stay:
                    </span>
                    <span>{selectedDestination.recommendedDuration}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#3A4F41] uppercase tracking-wider mb-2">
                    Key Park Highlights & Wildlife:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDestination.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700 bg-white p-2.5 rounded-sm border border-stone-200">
                        <Sparkles className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* External Partner & Directions Links */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedDestination.name + ' Kenya')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      tracker.outboundClick(
                        `Google Maps Directions to ${selectedDestination.name}`,
                        'Directions/Map',
                        `https://maps.google.com/?q=${encodeURIComponent(selectedDestination.name + ' Kenya')}`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-700" />
                    <span>Get Park Directions (Maps)</span>
                  </a>

                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Jungle Lane Safaris! I am interested in visiting ${selectedDestination.name}. Could you share current lodge rates and itinerary options?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      tracker.outboundClick(
                        `WhatsApp Inquiry for ${selectedDestination.name}`,
                        'WhatsApp',
                        CONTACT_INFO.whatsappUrl
                      );
                    }}
                    className="inline-flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border border-emerald-300"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ask Guide on WhatsApp</span>
                  </a>
                </div>

                {/* Modal CTA */}
                <div className="pt-4 border-t border-stone-300 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      const name = selectedDestination.name;
                      setSelectedDestination(null);
                      onOpenQuoteModal(name);
                      tracker.bookmarkItinerary(`Build Safari Proposal for ${name}`);
                    }}
                    className="w-full bg-[#C86D51] hover:bg-[#b05a41] text-white py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors text-center shadow cursor-pointer"
                  >
                    Build a Safari to {selectedDestination.name}
                  </button>
                  <button
                    onClick={() => setSelectedDestination(null)}
                    className="w-full sm:w-auto bg-stone-300 hover:bg-stone-400 text-stone-800 py-3 px-6 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

