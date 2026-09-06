import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2, Compass, Calendar, Users, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';
import { tracker } from '../lib/tracker';

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackage?: string;
}

export const CustomQuoteModal: React.FC<CustomQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedPackage
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [guestsCount, setGuestsCount] = useState('2 Guests');
  const [duration, setDuration] = useState('3-5 Days');
  const [travelStyle, setTravelStyle] = useState('Mid-Range');
  const [selectedParks, setSelectedParks] = useState<string[]>(
    preselectedPackage ? [preselectedPackage] : ['Maasai Mara']
  );
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const parkOptions = [
    'Maasai Mara Reserve',
    'Amboseli (Mt. Kilimanjaro)',
    'Lake Nakuru & Naivasha',
    'Samburu Reserve',
    'Diani Beach (Coastal Kenya)',
    'Tsavo West & East',
    'Nairobi 1-Day Excursions',
    'Ol Pejeta Rhino Conservancy'
  ];

  const handleParkToggle = (park: string) => {
    setSelectedParks((prev) =>
      prev.includes(park) ? prev.filter((p) => p !== park) : [...prev, park]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tracker.quoteSubmit(
      preselectedPackage || selectedParks.join(', '),
      selectedParks.length,
      travelStyle
    );
    setSubmitted(true);
  };

  const generateWhatsAppMessage = () => {
    const text = `Jambo Jungle Lane Safaris! I want to request a Custom Safari Quote:
• Name: ${fullName}
• Email: ${email}
• WhatsApp/Phone: ${phone}
• Travel Dates: ${travelDates || 'Flexible'}
• Guests: ${guestsCount}
• Duration: ${duration}
• Accommodation Style: ${travelStyle}
• Destinations: ${selectedParks.join(', ')}
• Notes: ${specialNotes || 'None'}

Please provide a custom proposal!`;

    return `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F9F6F0] rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-300 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-stone-200 hover:bg-stone-300 text-stone-700 p-2 rounded-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#222222]">
                Asante Sana! Quote Request Received
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                Thank you <strong className="text-[#222222]">{fullName}</strong>. Our local safari experts in Nairobi are preparing your customized itinerary.
              </p>
            </div>

            <div className="bg-white p-4 rounded-sm border border-stone-200 text-left text-xs space-y-1 max-w-md mx-auto">
              <span className="font-bold text-[#3A4F41] block">Summary of Inquiry:</span>
              <div>• Destinations: {selectedParks.join(', ')}</div>
              <div>• Travelers: {guestsCount} ({travelStyle})</div>
              <div>• Travel Period: {travelDates || 'Flexible'}</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => tracker.outboundClick('Quote Inquiry Direct', 'WhatsApp', generateWhatsAppMessage())}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-sm font-bold text-xs uppercase tracking-widest shadow flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Directly via WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto bg-stone-300 hover:bg-stone-400 text-stone-800 py-3.5 px-6 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C86D51] uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Tailor-Made Kenya Safaris</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
                {preselectedPackage ? `Customize "${preselectedPackage}"` : 'Book a Custom Safari / Get Free Quote'}
              </h2>
              <p className="text-xs text-stone-600">
                Fill in your travel preferences and our native Kenyan guides will design a personalized itinerary for your budget.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sarah Johnson"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., +1 234 567 890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C86D51]" />
                    Estimated Travel Dates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., August 2026 or Specific Dates"
                    value={travelDates}
                    onChange={(e) => setTravelDates(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#C86D51]" />
                    Travelers
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="1 Solo Traveler">1 Solo Traveler</option>
                    <option value="2 Guests (Couple/Friends)">2 Guests (Couple/Friends)</option>
                    <option value="3-4 Family Group">3-4 Family Group</option>
                    <option value="5+ Large Group">5+ Large Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Desired Duration
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
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="Budget Tented Camps">Budget Tented Camps</option>
                    <option value="Mid-Range Lodges">Mid-Range Lodges</option>
                    <option value="Luxury Fly-In">Luxury Fly-In Safari</option>
                    <option value="Private Group">Private Group</option>
                  </select>
                </div>
              </div>

              {/* Park Selector Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C86D51]" />
                  Select Parks You Wish to Visit:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {parkOptions.map((park) => {
                    const isSelected = selectedParks.includes(park);
                    return (
                      <button
                        type="button"
                        key={park}
                        onClick={() => handleParkToggle(park)}
                        className={`p-2 rounded-sm text-xs text-left border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#3A4F41] text-white border-[#3A4F41] font-bold'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-[#C86D51]'
                        }`}
                      >
                        <span>{park}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#E29578]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Interests / Dietary / Photography Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Photography focus, Hot air balloon safari request, vegetarian meals..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-sm py-2 px-3 text-xs text-[#222222] focus:ring-2 focus:ring-[#C86D51] outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full bg-[#C86D51] hover:bg-[#b05a41] text-white py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Quote Request</span>
                </button>

                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-5 rounded-sm font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
