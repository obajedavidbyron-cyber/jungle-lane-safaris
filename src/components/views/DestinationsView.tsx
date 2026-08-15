import React, { useState, useEffect } from 'react';
import { DestinationDoc, DestinationCategory } from '../../types';
import { destinationApi } from '../../lib/dataAccessLayer';
import { tracker } from '../../lib/tracker';
import {
  MapPin,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  Phone,
  Compass,
  Star,
  BookmarkPlus,
  Clock,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { ItineraryBuilderModal } from '../ItineraryBuilderModal';

interface DestinationsViewProps {
  onOpenQuoteModal: (destinationName?: string) => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Destinations', value: 'all' },
  { label: 'Wildlife & Nature', value: 'Nature' },
  { label: 'Historic Landmarks', value: 'Landmark' },
  { label: 'Adventures & Marine', value: 'Activity' },
  { label: 'Dining & Feasts', value: 'Restaurant' },
  { label: 'Cultural & Museums', value: 'Museum' }
];

export const DestinationsView: React.FC<DestinationsViewProps> = ({ onOpenQuoteModal }) => {
  const [destinations, setDestinations] = useState<DestinationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAttractionForItin, setSelectedAttractionForItin] = useState<string | undefined>(undefined);
  const [itinModalOpen, setItinModalOpen] = useState(false);

  // Fetch destinations from backend DAL
  const loadDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationApi.fetchAll({
        category: activeCategory !== 'all' ? activeCategory : undefined,
        tag: activeTag || undefined,
        search: searchQuery || undefined
      });
      setDestinations(res.data);
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [activeCategory, activeTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadDestinations();
    if (searchQuery.trim()) {
      tracker.search(searchQuery.trim(), destinations.length);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    tracker.filterUsage('Destination Category', cat);
  };

  const handleTagClick = (tag: string) => {
    const nextTag = activeTag === tag ? '' : tag;
    setActiveTag(nextTag);
    if (nextTag) {
      tracker.filterUsage('Tag', nextTag);
    }
  };

  const handleOpenItineraryBuilder = (attractionId?: string, attractionName?: string) => {
    setSelectedAttractionForItin(attractionId);
    setItinModalOpen(true);
    if (attractionName) {
      tracker.bookmarkItinerary(attractionName);
    }
  };

  const handleDirectionsClick = (dest: DestinationDoc) => {
    if (dest.direct_directions_url) {
      tracker.outboundClick(dest.name, 'Directions/Map', dest.direct_directions_url);
      window.open(dest.direct_directions_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePhoneClick = (dest: DestinationDoc) => {
    if (dest.phone_number) {
      tracker.outboundClick(dest.name, 'Phone', `tel:${dest.phone_number}`);
      window.location.href = `tel:${dest.phone_number}`;
    }
  };

  const handleWebsiteClick = (dest: DestinationDoc) => {
    if (dest.website_url) {
      tracker.outboundClick(dest.name, 'Partner Lodge', dest.website_url);
      window.open(dest.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 bg-[#F9F6F0] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner Section */}
        <div className="bg-[#3A4F41] text-white p-8 sm:p-12 rounded-sm relative overflow-hidden shadow-lg border border-[#2A3B30]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#C86D51] text-white px-3 py-1 rounded-xs text-[11px] font-bold uppercase tracking-wider">
                Database-Backed Kenya Travel Repository
              </span>
              <button
                onClick={() => handleOpenItineraryBuilder()}
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xs flex items-center gap-1.5 transition-colors border border-white/20"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-[#E5D7C4]" />
                <span>Open Itinerary Builder & Saved Spots</span>
              </button>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Iconic National Parks, Landmarks & Wildlife Sanctuaries
            </h1>
            <p className="text-[#E5D7C4] text-sm sm:text-base leading-relaxed">
              Explore authentic Kenyan attractions with exact geo-coordinates, verified opening hours, guest ratings, and direct external booking & maps links.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-6 rounded-sm border border-stone-300 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search destinations, tags (e.g. big-5, marine), or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xs focus:outline-none focus:border-[#C86D51]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#3A4F41] hover:bg-[#2A3B30] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick Count & Reset */}
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span>Showing <strong>{destinations.length}</strong> tourist attractions</span>
              {(activeCategory !== 'all' || activeTag || searchQuery) && (
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveTag('');
                    setSearchQuery('');
                  }}
                  className="text-[#C86D51] font-bold underline hover:text-[#b05a41]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xs transition-all ${
                  activeCategory === cat.value
                    ? 'bg-[#3A4F41] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1">Popular Tags:</span>
            {['big-5', 'family-friendly', 'marine', 'unesco-heritage', 'elephants', 'photography', 'dining', 'rhino-sanctuary'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-xs border transition-colors ${
                  activeTag === tag
                    ? 'bg-[#C86D51] text-white border-[#C86D51]'
                    : 'bg-stone-50 text-stone-600 border-stone-300 hover:border-stone-400'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Cards Grid / List */}
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-sm border border-stone-200">
            <div className="w-8 h-8 border-3 border-[#C86D51] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Loading destinations repository...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-sm border border-dashed border-stone-300 p-8 space-y-3">
            <Compass className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-700">No destinations match your criteria</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try choosing a different category or clearing the search keyword.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveTag('');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#3A4F41] text-white text-xs font-bold uppercase tracking-wider rounded-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {destinations.map((dest) => (
              <div
                key={dest.attraction_id}
                className="bg-white rounded-sm overflow-hidden shadow-sm border border-stone-300 flex flex-col lg:flex-row hover:border-[#3A4F41] transition-all"
              >
                {/* Image Section */}
                <div className="lg:w-5/12 relative min-h-[300px] bg-stone-900 overflow-hidden">
                  <img
                    src={dest.images[0] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'}
                    alt={dest.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="bg-[#C86D51] text-white text-[10px] font-bold px-2.5 py-1 rounded-xs uppercase shadow-sm">
                      {dest.category}
                    </span>
                    {dest.is_featured && (
                      <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-xs uppercase shadow-sm">
                        Featured Highlight
                      </span>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-xs flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{dest.average_rating}</span>
                    <span className="text-stone-400 text-[11px]">({dest.review_count.toLocaleString()} reviews)</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-[#C86D51] uppercase tracking-wider block">
                          {dest.location.city}, {dest.location.country}
                        </span>
                        <h2 className="text-2xl font-serif font-bold text-[#222222]">
                          {dest.name}
                        </h2>
                      </div>
                      
                      {/* Save to Itinerary Trigger */}
                      <button
                        onClick={() => handleOpenItineraryBuilder(dest.attraction_id, dest.name)}
                        className="px-3 py-1.5 bg-[#3A4F41]/10 hover:bg-[#3A4F41] text-[#3A4F41] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xs border border-[#3A4F41]/20 flex items-center gap-1.5 transition-colors self-start shrink-0"
                        title="Add this spot to your custom itinerary"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Add to Itinerary</span>
                      </button>
                    </div>

                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                      {dest.description}
                    </p>

                    {/* Metadata strip: Opening Hours, Coordinates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-stone-50 p-3 rounded-xs border border-stone-200 text-xs">
                      {dest.opening_hours && (
                        <div className="flex items-center gap-2 text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
                          <span><strong>Hours:</strong> {dest.opening_hours}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
                        <span>
                          <strong>GPS:</strong> {dest.location.latitude.toFixed(4)}, {dest.location.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.tags.map((t, idx) => (
                          <span
                            key={idx}
                            onClick={() => handleTagClick(t)}
                            className="bg-stone-100 hover:bg-stone-200 cursor-pointer text-stone-600 text-[10px] px-2 py-0.5 rounded-xs font-semibold"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar (Outbound Links + Custom Quote) */}
                  <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Outbound referral links */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {dest.direct_directions_url && (
                        <button
                          onClick={() => handleDirectionsClick(dest)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs font-bold flex items-center gap-1 transition-colors"
                          title="Get Google Maps Directions"
                        >
                          <Compass className="w-3.5 h-3.5 text-blue-600" />
                          <span>Directions</span>
                        </button>
                      )}
                      {dest.phone_number && (
                        <button
                          onClick={() => handlePhoneClick(dest)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs font-bold flex items-center gap-1 transition-colors"
                          title="Call venue direct"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call Venue</span>
                        </button>
                      )}
                      {dest.website_url && (
                        <button
                          onClick={() => handleWebsiteClick(dest)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs font-bold flex items-center gap-1 transition-colors"
                          title="Visit official website / partner portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
                          <span>Partner Link</span>
                        </button>
                      )}
                    </div>

                    {/* Proposal CTA */}
                    <button
                      onClick={() => onOpenQuoteModal(dest.name)}
                      className="px-5 py-2.5 bg-[#C86D51] hover:bg-[#b05a41] text-white rounded-xs font-bold text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Tailor Trip Including {dest.name}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itinerary Builder Modal */}
      <ItineraryBuilderModal
        isOpen={itinModalOpen}
        onClose={() => setItinModalOpen(false)}
        initialAttractionId={selectedAttractionForItin}
        onOpenQuoteModal={(title) => {
          setItinModalOpen(false);
          onOpenQuoteModal(title);
        }}
      />
    </div>
  );
};

