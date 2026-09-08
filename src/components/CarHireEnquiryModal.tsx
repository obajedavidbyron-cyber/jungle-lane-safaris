import React, { useState } from 'react';
import { X, MessageSquare, Phone, Mail, Copy, Check, Car, MapPin, Users, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO } from '../data/safariData';
import { CarHireCategoryItem } from '../types';
import { tracker } from '../lib/tracker';
import { JungleLaneLogo } from './JungleLaneLogo';

interface CarHireEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CarHireCategoryItem | null;
}

export const CarHireEnquiryModal: React.FC<CarHireEnquiryModalProps> = ({
  isOpen,
  onClose,
  category
}) => {
  if (!isOpen || !category) return null;

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const vehicleName = category.name;
  const whatsappMessage = `Hello Jungle Lane Safaris! I would like to enquire about hiring ${vehicleName} (${category.modelsExample || category.categoryLabel}) in Kenya. Please provide availability and rates.`;
  const whatsappHref = `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`;

  const emailSubject = `Car Hire Enquiry: ${vehicleName}`;
  const emailBody = `Hello Jungle Lane Safaris team,

I would like to enquire about renting a vehicle from your ${vehicleName} category (${category.modelsExample || ''}).

Travel Details:
- Preferred Pickup City (Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, Naivasha, Diani, etc.):
- Pickup Date:
- Return Date:
- Rental Type (Self-drive or Chauffeur-driven):
- Destination / Route in Kenya:

Please get back to me with availability and a quote.

Thank you!`;
  const emailHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const phoneHref = `tel:${CONTACT_INFO.phoneRaw}`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(CONTACT_INFO.phoneDisplay);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="bg-[#14422E] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JungleLaneLogo size="sm" variant="emblem" theme="light" id="car-enquiry-modal-emblem" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E29578] block">
                Direct Booking & Enquiries
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Enquire: {category.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Vehicle Snapshot Card */}
          <div className="flex gap-4 p-3.5 bg-stone-50 rounded-md border border-stone-200">
            <img
              src={category.imageUrl}
              alt={category.name}
              referrerPolicy="no-referrer"
              className="w-24 h-20 sm:w-28 sm:h-22 object-cover rounded-sm shrink-0 border border-stone-300"
            />
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C86D51] block">
                {category.categoryLabel}
              </span>
              <h4 className="font-serif font-bold text-sm text-[#14422E]">
                {category.name}
              </h4>
              {category.modelsExample && (
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  {category.modelsExample}
                </p>
              )}
              <div className="flex items-center gap-3 text-stone-600 font-medium pt-0.5">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-stone-400" />
                  {category.seats}
                </span>
                <span>•</span>
                <span>{category.transmission}</span>
              </div>
              {(category.driveType || category.fuelType) && (
                <div className="text-[11px] text-stone-500 font-medium pt-0.5">
                  Drive: {category.driveType || '2WD'} • Fuel: {category.fuelType || 'Petrol'}
                </div>
              )}
            </div>
          </div>

          {/* Direct Contact Options */}
          <div className="space-y-3">
            <p className="text-xs text-stone-600 font-medium text-center">
              Choose your preferred way to contact us directly. No registration or payment required:
            </p>

            {/* 1. WhatsApp Button */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker.outboundClick(`Car Hire Enquiry WhatsApp - ${category.name}`, 'WhatsApp', whatsappHref);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-all shadow-xs hover:shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-xs sm:text-sm">
                    Chat on WhatsApp
                  </span>
                  <span className="text-[11px] text-emerald-100 block">
                    Instant reply • {CONTACT_INFO.phoneDisplay}
                  </span>
                </div>
              </div>
              <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-sm uppercase font-bold tracking-wider">
                Fastest
              </span>
            </a>

            {/* 2. Direct Phone Call Button */}
            <a
              href={phoneHref}
              onClick={() => {
                tracker.outboundClick(`Car Hire Enquiry Phone - ${category.name}`, 'Phone', phoneHref);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-[#14422E] hover:bg-[#0E3020] text-white rounded-md transition-all shadow-xs hover:shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-xs sm:text-sm">
                    Call Us Directly
                  </span>
                  <span className="text-[11px] text-stone-300 block">
                    {CONTACT_INFO.phoneDisplay} • Nairobi Desk
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopyPhone();
                }}
                className="text-[11px] text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-sm flex items-center gap-1 transition-colors"
                title="Copy phone number"
              >
                {copiedPhone ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </a>

            {/* 3. Direct Email Button */}
            <a
              href={emailHref}
              onClick={() => {
                tracker.outboundClick(`Car Hire Enquiry Email - ${category.name}`, 'Email', emailHref);
              }}
              className="w-full flex items-center justify-between p-3.5 bg-stone-800 hover:bg-stone-900 text-white rounded-md transition-all shadow-xs hover:shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-xs sm:text-sm">
                    Send an Email
                  </span>
                  <span className="text-[11px] text-stone-300 block truncate max-w-[220px] sm:max-w-xs">
                    {CONTACT_INFO.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCopyEmail();
                }}
                className="text-[11px] text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-sm flex items-center gap-1 transition-colors"
                title="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-300" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </a>
          </div>

          {/* Quick Locations Reassurance */}
          <div className="p-3 bg-stone-100 rounded-md text-[11px] text-stone-700 flex items-start gap-2 border border-stone-200">
            <MapPin className="w-4 h-4 text-[#C86D51] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-800">Available across major Kenyan destinations:</span>
              <p className="text-stone-600 mt-0.5">
                Nairobi • Mombasa • Kisumu • Nakuru • Eldoret • Naivasha • Diani
              </p>
            </div>
          </div>

          {/* Close Action */}
          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="w-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-2.5 px-4 rounded-sm text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
