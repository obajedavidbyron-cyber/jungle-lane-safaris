import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2, Truck, Calendar, Users, MapPin, ShieldCheck, Check, Phone, Mail } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';
import { CAR_HIRE_FLEET } from '../data/carHireData';
import { tracker } from '../lib/tracker';
import { JungleLaneLogo } from './JungleLaneLogo';

interface CarHireQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedVehicleId?: string;
}

export const CarHireQuoteModal: React.FC<CarHireQuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedVehicleId
}) => {
  if (!isOpen) return null;

  const initialVehicle = CAR_HIRE_FLEET.find(v => v.id === preselectedVehicleId) || CAR_HIRE_FLEET[0];

  const [selectedVehicle, setSelectedVehicle] = useState(initialVehicle.id);
  const [rentalType, setRentalType] = useState<'Chauffeur-Driven' | 'Self-Drive' | 'Airport Transfer' | 'Corporate Lease'>('Chauffeur-Driven');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Nairobi JKIA Airport (NBO)');
  const [destinationRoute, setDestinationRoute] = useState('Maasai Mara National Reserve');
  const [passengersCount, setPassengersCount] = useState('4');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addOnOptions = [
    'Professional Safari Driver-Guide (English/Swahili)',
    'Complete Bush Camping Kit & Cooking Gear',
    'Rooftop Tent & Mattress Set',
    'Child Safety Car Seat',
    'Cross-Border COMESA Yellow Card Insurance',
    'Airport Meet-and-Greet Service'
  ];

  const toggleAddOn = (addon: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addon) ? prev.filter(item => item !== addon) : [...prev, addon]
    );
  };

  const currentVehicleObj = CAR_HIRE_FLEET.find(v => v.id === selectedVehicle) || initialVehicle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tracker.quoteSubmit(
      `Car Hire: ${currentVehicleObj.name} (${rentalType})`,
      parseInt(passengersCount, 10) || 1,
      rentalType
    );
    setSubmitted(true);
  };

  const generateWhatsAppMessage = () => {
    const text = `Jambo Jungle Lane Safaris! I want to request a Car Hire / Safari Vehicle Quote:
• Vehicle Requested: ${currentVehicleObj.name}
• Rental Option: ${rentalType}
• Client Name: ${fullName || 'Interested Traveler'}
• Contact Email: ${email || 'N/A'}
• WhatsApp/Phone: ${phone || 'N/A'}
• Pick-up Date: ${pickupDate || 'Flexible'}
• Return Date: ${returnDate || 'Flexible'}
• Pick-up Location: ${pickupLocation}
• Destination / Circuit: ${destinationRoute}
• Passengers: ${passengersCount}
• Add-ons: ${selectedAddOns.length > 0 ? selectedAddOns.join(', ') : 'None'}
• Special Notes: ${specialRequests || 'None'}

Please confirm availability and send your custom proposal!`;

    return `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F9F6F0] rounded-sm max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 border border-stone-300 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-stone-200 hover:bg-stone-300 text-stone-700 p-2 rounded-sm transition-colors cursor-pointer"
          aria-label="Close Modal"
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
                Asante Sana! Car Hire Request Received
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto">
                Thank you <strong className="text-[#222222]">{fullName}</strong>. Our fleet management team in Nairobi is reviewing your dates for the <strong>{currentVehicleObj.name}</strong>.
              </p>
            </div>

            <div className="bg-white p-5 rounded-sm border border-stone-200 text-left max-w-md mx-auto space-y-2.5 text-xs text-stone-700">
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="font-semibold text-stone-500">Selected Vehicle:</span>
                <span className="font-bold text-[#3A4F41]">{currentVehicleObj.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="font-semibold text-stone-500">Service Type:</span>
                <span className="font-bold text-stone-800">{rentalType}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1.5">
                <span className="font-semibold text-stone-500">Route / Circuit:</span>
                <span className="font-bold text-stone-800">{destinationRoute}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-stone-500">Pick-up Location:</span>
                <span className="font-bold text-stone-800">{pickupLocation}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  tracker.outboundClick('Car Hire Quote WhatsApp Confirmation', 'WhatsApp', CONTACT_INFO.whatsappUrl);
                }}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Instant Confirmation via WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-[#3A4F41] hover:bg-[#2D3E33] text-white font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-wider transition-all"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Modal Header */}
            <div className="space-y-2 border-b border-stone-100 pb-3">
              <JungleLaneLogo size="sm" variant="horizontal" theme="dark" id="car-hire-modal-logo" />
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#222222]">
                Car Hire Services & Enquiries
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Reliable and affordable car hire services for your journeys across Kenya. Choose a vehicle that suits your needs and get in touch with us to make your booking.
              </p>
            </div>

            {/* Direct Contact Action Strip: WhatsApp, Call, Email */}
            <div className="bg-stone-50 border border-stone-200 p-3 rounded-md space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                Direct Contact (Instant Response • No Registration Required):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(`Hello Jungle Lane Safaris! I want to enquire about hiring a vehicle in Kenya. Please provide availability and rates.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    tracker.outboundClick('Car Hire Modal WhatsApp Direct', 'WhatsApp', CONTACT_INFO.whatsappUrl);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Direct</span>
                </a>

                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  onClick={() => {
                    tracker.outboundClick('Car Hire Modal Call Direct', 'Phone', `tel:${CONTACT_INFO.phoneRaw}`);
                  }}
                  className="bg-[#14422E] hover:bg-[#0E3020] text-white p-2.5 rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {CONTACT_INFO.phoneDisplay}</span>
                </a>

                <a
                  href={`mailto:${CONTACT_INFO.email}?subject=Car Hire Enquiry - Jungle Lane Safaris`}
                  onClick={() => {
                    tracker.outboundClick('Car Hire Modal Email Direct', 'Email', `mailto:${CONTACT_INFO.email}`);
                  }}
                  className="bg-stone-800 hover:bg-stone-900 text-white p-2.5 rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Us</span>
                </a>
              </div>
            </div>

            {/* Quick Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="bg-stone-100 p-2 rounded-xs text-[11px] text-stone-700 flex items-center gap-1.5 font-medium border border-stone-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>PSV Insurance</span>
              </div>
              <div className="bg-stone-100 p-2 rounded-xs text-[11px] text-stone-700 flex items-center gap-1.5 font-medium border border-stone-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Pop-Up Roof</span>
              </div>
              <div className="bg-stone-100 p-2 rounded-xs text-[11px] text-stone-700 flex items-center gap-1.5 font-medium border border-stone-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>24/7 Roadside Help</span>
              </div>
              <div className="bg-stone-100 p-2 rounded-xs text-[11px] text-stone-700 flex items-center gap-1.5 font-medium border border-stone-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Airport Pickup</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Vehicle & Rental Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Select Vehicle Model *
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] font-medium focus:ring-1 focus:ring-[#C86D51] outline-none"
                    required
                  >
                    {CAR_HIRE_FLEET.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.categoryLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Rental Option *
                  </label>
                  <select
                    value={rentalType}
                    onChange={(e) => setRentalType(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] font-medium focus:ring-1 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="Chauffeur-Driven">Chauffeur-Driven (With Professional Driver-Guide)</option>
                    <option value="Self-Drive">Self-Drive 4x4 (Independent Travel)</option>
                    <option value="Airport Transfer">Airport Meet-and-Greet Transfer</option>
                    <option value="Corporate Lease">Corporate & Long-Term Fleet Lease</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Dates & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Pick-up Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Passengers *
                  </label>
                  <select
                    value={passengersCount}
                    onChange={(e) => setPassengersCount(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="4">3-4 Passengers</option>
                    <option value="6">5-6 Passengers</option>
                    <option value="8">7-8 Passengers</option>
                    <option value="15">9-15 Passengers (Van / Bus)</option>
                    <option value="25">16-28 Passengers (Coaster)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Pick-up Location & Circuit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Pick-Up Location *
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  >
                    <option value="Nairobi JKIA Airport (NBO)">Nairobi JKIA Airport (International Terminal)</option>
                    <option value="Nairobi Wilson Airport (WIL)">Nairobi Wilson Airport (Safari Flight Terminal)</option>
                    <option value="Nairobi CBD Office (Kimathi St)">Jungle Lane Safaris Office (Nairobi CBD)</option>
                    <option value="Hotel Delivery (Nairobi)">Nairobi Hotel / Residence Delivery</option>
                    <option value="Mombasa / Diani Beach">Mombasa / Diani Beach</option>
                    <option value="Kisumu / Western Kenya">Kisumu / Western Kenya</option>
                    <option value="Other Location">Other Custom Location</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Intended Route / National Parks *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maasai Mara, Amboseli, Naivasha or City"
                    value={destinationRoute}
                    onChange={(e) => setDestinationRoute(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-sm px-3 py-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                  />
                </div>
              </div>

              {/* Add-ons Checklist */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Optional Equipment & Add-On Services:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {addOnOptions.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon);
                    return (
                      <button
                        type="button"
                        key={addon}
                        onClick={() => toggleAddOn(addon)}
                        className={`text-left p-2 rounded-xs border text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-[#3A4F41] text-white border-[#3A4F41]'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center border ${
                          isChecked ? 'bg-[#C86D51] border-[#C86D51] text-white' : 'border-stone-400'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{addon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Specific Requirements or Route Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention flight numbers, extra luggage, cross-border permits to Tanzania, or special safari gear..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-sm p-2 text-xs text-[#222222] focus:ring-1 focus:ring-[#C86D51] outline-none"
                />
              </div>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-[#C86D51] hover:bg-[#b05a41] text-white font-bold py-3 rounded-sm uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Car Hire Request</span>
                </button>

                <a
                  href={generateWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    tracker.outboundClick('Car Hire Direct WhatsApp Inquire', 'WhatsApp', CONTACT_INFO.whatsappUrl);
                  }}
                  className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-sm uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Direct WhatsApp Inquire</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
