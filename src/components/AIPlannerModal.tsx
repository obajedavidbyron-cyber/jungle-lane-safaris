import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, Compass, CheckCircle2, Loader2, Calendar, MapPin, Info } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';
import { tracker } from '../lib/tracker';

interface AIPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPlannerModal: React.FC<AIPlannerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [duration, setDuration] = useState('3-5 Days');
  const [style, setStyle] = useState('Mid-Range');
  const [pax, setPax] = useState('2 Travelers');
  const [destinations, setDestinations] = useState<string[]>(['Maasai Mara', 'Lake Nakuru']);
  const [interests, setInterests] = useState<string[]>(['Big 5 Wildlife', 'Photography']);
  const [loading, setLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const allDestinations = ['Maasai Mara', 'Amboseli', 'Lake Nakuru', 'Lake Naivasha', 'Samburu', 'Diani Beach', 'Tsavo West'];
  const allInterests = ['Big 5 Wildlife', 'Photography', 'Maasai Culture', 'Hot Air Balloon', 'Bird Watching', 'Beach Relax', 'Family Friendly'];

  const toggleDest = (d: string) => {
    setDestinations((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const toggleInterest = (i: string) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((item) => item !== i) : [...prev, i]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setGeneratedItinerary(null);

    try {
      const res = await fetch('/api/ai-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          style,
          pax,
          destinations,
          interests
        })
      });

      const data = await res.json();
      if (data.itinerary) {
        setGeneratedItinerary(data.itinerary);
        tracker.aiItineraryGenerated(destinations, style);
      } else {
        // Fallback proposal if API key is not active
        const fallback = {
          title: `Custom ${duration} ${destinations.join(' & ')} Safari Proposal`,
          summary: `A tailor-made East Africa safari experience combining wildlife tracking in ${destinations.join(', ')} with professional native Maasai driver guides.`,
          recommendedLodging: style === 'Luxury' ? 'Luxury Tented Camps with Private Plunge Pools' : 'Eco-Safari Tented Camps & Lodges',
          bestTime: 'June to October & December to March',
          highlights: [
            'Private 4x4 Land Cruiser with pop-up roof',
            'Full day game drives tracking lions, cheetahs & elephants',
            'Authentic Maasai cultural interactions',
            'Full board meals & airport transfers'
          ],
          dayByDay: [
            { day: 1, title: 'Nairobi to ' + (destinations[0] || 'Maasai Mara'), description: 'Morning departure via Rift Valley escarpment. Arrive at lodge for hot lunch and afternoon game drive.' },
            { day: 2, title: 'Full Day Wildlife Tracking & River Safari', description: 'Extensive game drives with packed picnic lunch in prime wildlife zones.' },
            { day: 3, title: 'Sunrise Safari & Return to Nairobi', description: 'Morning predator watch, hearty breakfast, and return journey to Nairobi.' }
          ],
          inclusions: ['Private 4x4 Land Cruiser', 'Park entry fees', 'Full board meals', 'English/Swahili driver guide'],
          exclusions: ['International flights', 'Tips & personal items']
        };
        setGeneratedItinerary(fallback);
        tracker.aiItineraryGenerated(destinations, style);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to AI advisor. Please try again or WhatsApp us directly!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F9F6F0] rounded-sm max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-300 animate-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-stone-200 hover:bg-stone-300 text-stone-700 p-2 rounded-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#3A4F41] text-[#E29578] px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Powered Safari Planner</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
              Instant Tailor-Made Itinerary Generator
            </h2>
            <p className="text-xs text-stone-600">
              Select your travel parameters and our AI system trained on Jungle Lane Safaris' local knowledge will draft a custom day-by-day proposal!
            </p>
          </div>

          {!generatedItinerary ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="1 Day Excursion">1 Day Excursion</option>
                    <option value="3-5 Days">3 - 5 Days</option>
                    <option value="7-10 Days">7 - 10 Days</option>
                    <option value="12+ Days Grand Tour">12+ Days Grand Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Travel Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="Budget">Budget Tented Camps</option>
                    <option value="Mid-Range">Mid-Range Lodges</option>
                    <option value="Luxury">Luxury Fly-In Safari</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Travelers
                  </label>
                  <select
                    value={pax}
                    onChange={(e) => setPax(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="1 Guest">1 Solo Guest</option>
                    <option value="2 Guests">2 Guests (Couple/Friends)</option>
                    <option value="Family 4 Guests">Family (4 Guests)</option>
                    <option value="Group 6+ Guests">Group 6+ Guests</option>
                  </select>
                </div>
              </div>

              {/* Destinations */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
                  Preferred National Parks:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allDestinations.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleDest(d)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                        destinations.includes(d)
                          ? 'bg-[#3A4F41] text-white border-[#3A4F41]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#C86D51]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-[#C86D51]" />
                  Special Experiences:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allInterests.map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
                        interests.includes(i)
                          ? 'bg-[#C86D51] text-white border-[#C86D51]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#C86D51]'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-sm border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3A4F41] hover:bg-[#2B3B30] text-white py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Designing Your Custom Safari Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Safari Itinerary</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-[#3A4F41] text-white p-5 rounded-sm shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E29578] uppercase tracking-wider">
                    Custom Proposal Generated
                  </span>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-xs">
                    Tailor-Made Proposal
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {generatedItinerary.title}
                </h3>
                <p className="text-xs text-stone-300">
                  {generatedItinerary.summary}
                </p>
              </div>

              {/* Highlights */}
              <div className="bg-white p-4 rounded-sm border border-stone-200">
                <h4 className="text-xs font-bold text-[#3A4F41] uppercase tracking-wider mb-2">
                  Trip Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {generatedItinerary.highlights?.map((h: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day By Day */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#3A4F41] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C86D51]" />
                  Day-by-Day Outline:
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {generatedItinerary.dayByDay?.map((day: any, idx: number) => (
                    <div key={idx} className="bg-stone-100 p-3 rounded-sm border border-stone-200 text-xs">
                      <strong className="text-[#3A4F41] block font-serif text-sm">
                        Day {day.day}: {day.title}
                      </strong>
                      <p className="text-stone-600 mt-1">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                    `Jambo Jungle Lane Safaris! I generated this AI Proposal: "${generatedItinerary.title}" for ${pax}. Please finalize available lodge dates and pricing!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => tracker.outboundClick('AI Proposal WhatsApp', 'WhatsApp', `${CONTACT_INFO.whatsappUrl}`)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Proposal via WhatsApp</span>
                </a>

                <button
                  onClick={() => setGeneratedItinerary(null)}
                  className="w-full sm:w-auto bg-stone-300 hover:bg-stone-400 text-stone-800 py-3.5 px-6 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Adjust Parameters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
